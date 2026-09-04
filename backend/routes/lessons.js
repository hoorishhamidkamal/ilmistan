import { Router } from 'express';
import LessonProgress from '../models/LessonProgress.js';
import User from '../models/User.js';
import authenticate from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.post('/complete', async (request, response, next) => {
  try {
    const { lessonId, lessonName } = request.body;
    if (!String(lessonId || '').trim() || !String(lessonName || '').trim()) return response.status(400).json({ error: 'Lesson ID and name are required.' });
    const lessonKey = String(lessonId).trim();
    const existingProgress = await LessonProgress.findOne({ userId: request.user.userId, lessonId: lessonKey });
    if (existingProgress?.completed) return response.json({ message: 'Lesson was already completed.', progress: existingProgress });
    const wasCompleted = existingProgress?.completed === true;
    const progress = existingProgress || new LessonProgress({ userId: request.user.userId, lessonId: lessonKey });
    progress.lessonName = String(lessonName).trim();
    progress.completed = true;
    progress.completedAt = new Date();
    await progress.save();
    if (!wasCompleted) {
      await User.findByIdAndUpdate(request.user.userId, { $inc: { 'stats.completedLessons': 1 } });
    }
    return response.status(201).json({ message: 'Lesson progress saved successfully.', progress });
  } catch (error) {
    return next(error);
  }
});

router.get('/progress', async (request, response, next) => {
  try {
    const progress = await LessonProgress.find({ userId: request.user.userId }).sort({ completedAt: -1 }).lean();
    return response.json({ progress });
  } catch (error) {
    return next(error);
  }
});

export default router;
