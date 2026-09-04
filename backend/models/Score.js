import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  activityName: { type: String, required: true, trim: true, maxlength: 120 },
  activityType: { type: String, enum: ['lesson', 'quiz', 'game'], required: true },
  score: { type: Number, required: true, min: 0 },
  totalScore: { type: Number, required: true, min: 1 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Score', scoreSchema);