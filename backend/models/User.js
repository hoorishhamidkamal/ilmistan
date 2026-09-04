import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['parent', 'child'], default: 'child' },
  stats: {
    totalPoints: { type: Number, default: 0, min: 0 },
    totalStars: { type: Number, default: 0, min: 0 },
    completedGames: { type: Number, default: 0, min: 0 },
    completedLessons: { type: Number, default: 0, min: 0 }
  },
  dailyProgress: { type: Map, of: Number, default: {} }
}, { timestamps: true });

export default mongoose.model('User', userSchema);