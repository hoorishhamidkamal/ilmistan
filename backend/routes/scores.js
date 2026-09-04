import { Router } from 'express';
import Score from '../models/Score.js';
import authenticate from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.post('/save', async (request, response, next) => {
  try {
    const { gameName, score, totalQuestions } = request.body;
    const cleanGameName = String(gameName || '').trim();
    const numericScore = Number(score);
    const numericTotalQuestions = Number(totalQuestions);
    if (!cleanGameName) return response.status(400).json({ error: 'Game name is required.' });
    if (!Number.isFinite(numericScore) || !Number.isFinite(numericTotalQuestions) || numericTotalQuestions <= 0 || numericScore < 0 || numericScore > numericTotalQuestions) {
      return response.status(400).json({ error: 'Please provide a valid score.' });
    }

    const scoreRecord = await Score.findOneAndUpdate(
      { userId: request.user.userId, gameName: cleanGameName },
      {
        userId: request.user.userId,
        activityName: cleanGameName,
        activityType: 'game',
        gameName: cleanGameName,
        score: numericScore,
        totalScore: numericTotalQuestions,
        totalQuestions: numericTotalQuestions,
        percentage: Math.round((numericScore / numericTotalQuestions) * 100),
        date: new Date()
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();
    return response.status(200).json({ message: 'Score saved successfully.', score: scoreRecord });
  } catch (error) {
    return next(error);
  }
});

router.get('/:userId', async (request, response, next) => {
  try {
    if (request.params.userId !== request.user.userId) return response.status(403).json({ error: 'You can only view your own score history.' });
    const history = await Score.find({ userId: request.params.userId, activityType: 'game', gameName: { $exists: true } }).sort({ date: -1 }).lean();
    return response.json({ history });
  } catch (error) {
    return next(error);
  }
});

export default router;