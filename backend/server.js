import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import gameRoutes from './routes/games.js';
import lessonRoutes from './routes/lessons.js';
import dashboardRoutes from './routes/dashboard.js';

const port = Number(process.env.PORT || 5000);

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  throw new Error('MONGODB_URI and JWT_SECRET must be set in backend/.env');
}

const app = express();
const allowedOrigins = (process.env.FRONTEND_URLS || 'http://localhost:5173,http://localhost:5174').split(',').map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'ilmistan-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'The server could not complete the request.' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(port, () => console.log(`Ilmistan API running at http://localhost:${port}`)))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
