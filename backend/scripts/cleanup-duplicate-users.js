import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import GameScore from '../models/GameScore.js';
import LessonProgress from '../models/LessonProgress.js';
import Score from '../models/Score.js';

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI must be set in backend/.env');

const activityCount = async (userId) => {
  const [games, lessons, scores] = await Promise.all([
    GameScore.countDocuments({ userId }),
    LessonProgress.countDocuments({ userId }),
    Score.countDocuments({ userId })
  ]);
  return games + lessons + scores;
};

const compareUsers = (left, right) => {
  const leftIsHooray = left.name.trim().toLowerCase() === 'hooray';
  const rightIsHooray = right.name.trim().toLowerCase() === 'hooray';
  if (leftIsHooray !== rightIsHooray) return leftIsHooray ? -1 : 1;
  if (left.activityCount !== right.activityCount) return right.activityCount - left.activityCount;
  const leftPoints = left.stats?.totalPoints || 0;
  const rightPoints = right.stats?.totalPoints || 0;
  if (leftPoints !== rightPoints) return rightPoints - leftPoints;
  return new Date(right.updatedAt || right.createdAt).getTime() - new Date(left.updatedAt || left.createdAt).getTime();
};

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const duplicateGroups = await User.aggregate([
    { $project: { email: 1, normalizedEmail: { $toLower: { $trim: { input: '$email' } } } } },
    { $group: { _id: '$normalizedEmail', userIds: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]);

  let deletedCount = 0;
  for (const group of duplicateGroups) {
    const users = await User.find({ _id: { $in: group.userIds } }).lean();
    const rankedUsers = await Promise.all(users.map(async (user) => ({ ...user, activityCount: await activityCount(user._id) })));
    rankedUsers.sort(compareUsers);
    const [activeUser, ...duplicates] = rankedUsers;
    const duplicateIds = duplicates.map((user) => user._id);

    await Promise.all([
      GameScore.deleteMany({ userId: { $in: duplicateIds } }),
      LessonProgress.deleteMany({ userId: { $in: duplicateIds } }),
      Score.deleteMany({ userId: { $in: duplicateIds } }),
      User.deleteMany({ _id: { $in: duplicateIds } })
    ]);
    deletedCount += duplicateIds.length;
    console.log(`Kept ${activeUser.email} (${activeUser.name}); deleted ${duplicateIds.length} duplicate account(s).`);
  }

  await User.syncIndexes();
  console.log(`Cleanup complete. Deleted ${deletedCount} duplicate account(s); unique email index enforced.`);
} finally {
  await mongoose.disconnect();
}