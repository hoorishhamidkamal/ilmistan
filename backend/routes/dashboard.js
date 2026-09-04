import { Router } from 'express';
import User from '../models/User.js';
import GameScore from '../models/GameScore.js';
import LessonProgress from '../models/LessonProgress.js';
import authenticate from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', async (request, response, next) => {
  try {
    const [user, gameScores, lessonProgress] = await Promise.all([
      User.findById(request.user.userId).select('name email role stats dailyProgress createdAt updatedAt').lean(),
      GameScore.find({ userId: request.user.userId }).sort({ playedAt: -1 }).limit(100).lean(),
      LessonProgress.find({ userId: request.user.userId }).sort({ completedAt: -1 }).lean()
    ]);
    if (!user) return response.status(404).json({ error: 'User account was not found.' });
    const stats = { totalPoints: 0, totalStars: 0, completedGames: 0, completedLessons: 0, ...(user.stats || {}) };
    const dailyProgress = user.dailyProgress instanceof Map
      ? Object.fromEntries(user.dailyProgress)
      : (user.dailyProgress || {});
    const recentScores = gameScores.filter((game) => game.completed && game.gameName !== 'ڈرائنگ بورڈ').map((game) => ({
      ...game,
      percentage: game.totalQuestions ? Math.min(100, Math.round((game.score / game.totalQuestions) * 100)) : 0
    }));
    const averagePercentage = recentScores.length
      ? Math.round(recentScores.reduce((total, game) => total + game.percentage, 0) / recentScores.length)
      : 0;
    const recentActivities = [...recentScores, ...lessonProgress.filter((lesson) => lesson.completed)]
      .sort((first, second) => new Date(second.playedAt || second.completedAt).getTime() - new Date(first.playedAt || first.completedAt).getTime())
      .slice(0, 10);
    return response.json({
      user,
      totalPoints: stats.totalPoints,
      totalStars: stats.totalStars,
      dailyProgress,
      completedGames: stats.completedGames,
      completedLessons: stats.completedLessons,
      averagePercentage,
      recentScores,
      recentActivities,
      stats,
      gameScores,
      recentGameHistory: gameScores.slice(0, 10),
      lessonProgress
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
