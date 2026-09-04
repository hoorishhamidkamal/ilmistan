import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  lessonId: { type: String, required: true, trim: true, maxlength: 120 },
  lessonName: { type: String, required: true, trim: true, maxlength: 120 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model('LessonProgress', lessonProgressSchema);
