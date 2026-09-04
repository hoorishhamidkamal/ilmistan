import { Router } from 'express';
import GameScore from '../models/GameScore.js';
import User from '../models/User.js';
import authenticate from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

const starsForCompletion = 20;
const starsPerCorrectAnswer = 20;

const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);

router.post('/score', async (request, response, next) => {
  try {
    const { gameName, score, pointsEarned, correctAnswers, totalQuestions, completed = true, completionId } = request.body;
    const numericScore = Number(score);
    const numericPoints = Number(pointsEarned ?? score);
    const numericCorrect = Number(correctAnswers ?? score);
    const numericTotal = Number(totalQuestions);
    if (!String(gameName || '').trim()) return response.status(400).json({ error: 'Game name is required.' });
    if (!Number.isFinite(numericScore) || !Number.isFinite(numericPoints) || !Number.isFinite(numericCorrect) || !Number.isFinite(numericTotal) || numericTotal <= 0 || numericScore < 0 || numericCorrect < 0 || numericCorrect > numericTotal || numericPoints < 0) {
      return response.status(400).json({ error: 'Please provide a valid game score.' });
    }

    const isCompleted = Boolean(completed);
    const dateKey = todayKey();
    const starsFromAnswers = numericCorrect * starsPerCorrectAnswer;
    const starsEarned = numericPoints > 0
      ? numericPoints
      : (starsFromAnswers > 0 ? starsFromAnswers : (isCompleted ? starsForCompletion : 0));

    const scoreRecord = await GameScore.create({
      userId: request.user.userId,
      gameName: String(gameName).trim(),
      score: numericScore,
      pointsEarned: numericPoints,
      starsEarned,
      correctAnswers: numericCorrect,
      totalQuestions: numericTotal,
      completed: isCompleted,
      completionId: completionId ? String(completionId) : undefined
    });

    let userStats = null;
    if (starsEarned > 0 || isCompleted) {
      const updatedUser = await User.findByIdAndUpdate(
        request.user.userId,
        {
          $inc: {
            'stats.totalPoints': numericPoints,
            'stats.totalStars': starsEarned,
            ...(isCompleted ? { 'stats.completedGames': 1 } : {}),
            [`dailyProgress.${dateKey}`]: starsEarned
          }
        },
        { new: true, projection: 'stats dailyProgress' }
      ).lean();
      userStats = updatedUser?.stats || null;
    }
    return response.status(201).json({ message: 'Game score saved successfully.', score: scoreRecord, stats: userStats });
  } catch (error) {
    if (error.code === 11000) return response.status(200).json({ message: 'Game score was already saved.', duplicate: true });
    return next(error);
  }
});

router.get('/history', async (request, response, next) => {
  try {
    const history = await GameScore.find({ userId: request.user.userId }).sort({ playedAt: -1 }).limit(100).lean();
    return response.json({ history });
  } catch (error) {
    return next(error);
  }
});

export default router;