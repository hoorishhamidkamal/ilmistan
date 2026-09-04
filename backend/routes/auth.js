import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authenticate from '../middleware/auth.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, stats: user.stats, createdAt: user.createdAt });
const tokenFor = (user) => jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = async (request, response, next) => {
  try {
    const { name, email, password, role = 'child' } = request.body;
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!String(name || '').trim()) return response.status(400).json({ error: 'Name is required.' });
    if (!emailPattern.test(cleanEmail)) return response.status(400).json({ error: 'Please provide a valid email address.' });
    if (typeof password !== 'string' || password.length < 6) return response.status(400).json({ error: 'Password must be at least 6 characters long.' });
    if (!['parent', 'child'].includes(role)) return response.status(400).json({ error: 'Role must be parent or child.' });
    if (await User.exists({ email: cleanEmail })) return response.status(409).json({ error: 'An account with this email already exists.' });
    const user = await User.create({ name: String(name).trim(), email: cleanEmail, password: await bcrypt.hash(password, 12), role });
    return response.status(201).json({ message: 'Account created successfully.', user: publicUser(user), token: tokenFor(user) });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ error: 'An account with this email already exists.' });
    return next(error);
  }
};

router.post('/register', register);
router.post('/signup', register);

const login = async (request, response, next) => {
  try {
    const cleanEmail = String(request.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user || !(await bcrypt.compare(String(request.body.password || ''), user.password))) return response.status(401).json({ error: 'Email or password is incorrect.' });
    return response.json({ message: 'Login successful.', user: publicUser(user), token: tokenFor(user) });
  } catch (error) {
    return next(error);
  }
};

router.post('/login', login);
router.post('/signin', login);

router.get('/me', authenticate, async (request, response, next) => {
  try {
    const user = await User.findById(request.user.userId);
    if (!user) return response.status(404).json({ error: 'User account was not found.' });
    return response.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;