import jwt from 'jsonwebtoken';

export default function authenticate(request, response, next) {
  const header = request.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return response.status(401).json({ error: 'Authentication token is required.' });
  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }
}