import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export default function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next({ status: 401, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(err); // Caught by error middleware (JsonWebTokenError / TokenExpiredError)
  }
}