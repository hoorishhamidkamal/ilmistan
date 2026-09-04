import mongoose from 'mongoose';

const gameScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  gameName: { type: String, required: true, trim: true, maxlength: 120 },
  score: { type: Number, required: true, min: 0 },
  pointsEarned: { type: Number, required: true, min: 0 },
  starsEarned: { type: Number, min: 0, default: 20 },
  correctAnswers: { type: Number, required: true, min: 0 },
  totalQuestions: { type: Number, required: true, min: 1 },
  completed: { type: Boolean, default: false },
  completionId: { type: String, trim: true },
  playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

gameScoreSchema.index({ userId: 1, completionId: 1 }, { unique: true, sparse: true });

export default mongoose.model('GameScore', gameScoreSchema);
