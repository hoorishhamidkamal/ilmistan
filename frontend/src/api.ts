export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'child';
}

export interface ScoreHistory {
  _id: string;
  activityName: string;
  activityType: 'lesson' | 'quiz' | 'game';
  score: number;
  totalScore: number;
  percentage: number;
  createdAt: string;
}

export interface ProgressSummary {
  currentScore: number;
  totalScore: number;
  completedActivities: number;
  averagePercentage: number;
}

export interface UserStats {
  totalPoints: number;
  totalStars: number;
  completedGames: number;
  completedLessons: number;
}

export interface GameScore {
  _id: string;
  gameName: string;
  score: number;
  pointsEarned: number;
  starsEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  completed: boolean;
  playedAt: string;
}

export interface LessonProgress {
  _id: string;
  lessonId: string;
  lessonName: string;
  completed: boolean;
  completedAt: string;
}

export interface DashboardData {
  user: AuthUser;
  stats: UserStats;
  totalPoints: number;
  totalStars: number;
  dailyProgress: Record<string, number>;
  completedGames: number;
  completedLessons: number;
  averagePercentage: number;
  recentScores: Array<GameScore & { percentage: number }>;
  recentActivities: Array<GameScore | LessonProgress>;
  gameScores: GameScore[];
  recentGameHistory: GameScore[];
  lessonProgress: LessonProgress[];
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('ilmistan_token') ? { Authorization: `Bearer ${localStorage.getItem('ilmistan_token')}` } : {}),
      ...options?.headers
    }
  });
  const responseText = await response.text();
  let payload: (T & { error?: string }) | null = null;
  if (responseText.trim()) {
    try {
      payload = JSON.parse(responseText) as T & { error?: string };
    } catch {
      throw new Error(`The server returned an invalid response (${response.status}).`);
    }
  }
  if (!response.ok) throw new Error(payload?.error || 'Request failed.');
  if (!payload) throw new Error('The server returned an empty response.');
  return payload;
}

export async function register(input: { name: string; email: string; password: string; role: 'parent' | 'child' }) {
  const result = await request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(input) });
  localStorage.setItem('ilmistan_token', result.token);
  return result;
}

export async function login(input: { email: string; password: string }) {
  const result = await request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) });
  localStorage.setItem('ilmistan_token', result.token);
  return result;
}

export function logout() {
  localStorage.removeItem('ilmistan_token');
}

export function saveScore(input: { activityName: string; activityType: 'lesson' | 'quiz' | 'game'; score: number; totalScore: number }) {
  return request<{ score: ScoreHistory }>('/api/progress/score', { method: 'POST', body: JSON.stringify(input) });
}

export function getProgressHistory() {
  return request<{ history: ScoreHistory[] }>('/api/progress/history');
}

export function getProgressSummary() {
  return request<ProgressSummary>('/api/progress/summary');
}

export function saveGameScore(input: { gameName: string; score: number; pointsEarned: number; correctAnswers: number; totalQuestions: number; completionId?: string; completed?: boolean }) {
  return request<{ score: GameScore; stats: UserStats | null; totalStars?: number; dailyProgress?: Record<string, number> }>('/api/games/score', { method: 'POST', body: JSON.stringify(input) });
}

export function getMe() {
  return request<{ user: AuthUser }>('/api/auth/me');
}

export function getDashboard() {
  return request<DashboardData>('/api/dashboard');
}

export function completeLesson(input: { lessonId: string; lessonName: string }) {
  return request<{ progress: LessonProgress }>('/api/lessons/complete', { method: 'POST', body: JSON.stringify(input) });
}

export function getLessonProgress() {
  return request<{ progress: LessonProgress[] }>('/api/lessons/progress');
}
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}
