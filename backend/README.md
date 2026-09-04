# Ilmistan backend

## Setup

1. Install MongoDB locally, or create a MongoDB Atlas database.
2. From this directory, install dependencies:

```powershell
npm install
```

3. Create `backend/.env` from `.env.example` and set `MONGODB_URI` and a long random `JWT_SECRET`.

## Run

From `backend/`:

```powershell
npm run dev
```

From `frontend/` in a second terminal:

```powershell
npm install
npm run dev
```

Vite proxies `/api` requests to `http://localhost:5000`.

## API

- `POST /api/auth/register` creates a bcrypt-hashed user in MongoDB.
- `POST /api/auth/login` validates credentials and returns a JWT.
- `GET /api/auth/me` returns the authenticated user with `Authorization: Bearer <token>`.
- `POST /api/auth/signup` and `POST /api/auth/signin` are aliases for registration and login.
- `POST /api/games/score` and `GET /api/games/history` manage authenticated game attempts.
- `POST /api/lessons/complete` and `GET /api/lessons/progress` manage authenticated lesson progress.
- `GET /api/dashboard` returns the current user's stats and recent activity.
- `GET /api/health` checks that the API process is reachable.