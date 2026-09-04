import { Router } from 'express';
import mongoose from 'mongoose';
import Score from '../models/Score.js';
import authenticate from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.post('/score', async (request, response, next) => {
  try {
    const { activityName, activityType, score, totalScore } = request.body;
    const numericScore = Number(score);
    const numericTotal = Number(totalScore);
    if (!String(activityName || '').trim()) return response.status(400).json({ error: 'Activity name is required.' });
    if (!['lesson', 'quiz', 'game'].includes(activityType)) return response.status(400).json({ error: 'Activity type must be lesson, quiz, or game.' });
    if (!Number.isFinite(numericScore) || !Number.isFinite(numericTotal) || numericTotal <= 0 || numericScore < 0 || numericScore > numericTotal) {
      return response.status(400).json({ error: 'Score must be between zero and the maximum score.' });
    }
    const scoreRecord = await Score.create({
      userId: request.user.userId,
      activityName: String(activityName).trim(),
      activityType,
      score: numericScore,
      totalScore: numericTotal,
      percentage: Math.round((numericScore / numericTotal) * 100)
    });
    return response.status(201).json({ message: 'Score saved successfully.', score: scoreRecord });
  } catch (error) {
    return next(error);
  }
});

router.get('/history', async (request, response, next) => {
  try {
    const history = await Score.find({ userId: request.user.userId }).sort({ createdAt: -1 }).limit(50).lean();
    return response.json({ history });
  } catch (error) {
    return next(error);
  }
});

router.get('/summary', async (request, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.user.userId);
    const [summary] = await Score.aggregate([
      { $match: { userId } },
      { $group: { _id: null, currentScore: { $sum: '$score' }, totalScore: { $sum: '$totalScore' }, completedActivities: { $sum: 1 }, averagePercentage: { $avg: '$percentage' } } }
    ]);
    return response.json({
      currentScore: summary?.currentScore || 0,
      totalScore: summary?.totalScore || 0,
      completedActivities: summary?.completedActivities || 0,
      averagePercentage: Math.round(summary?.averagePercentage || 0)
    });
  } catch (error) {
    return next(error);
  }
});

export default router;