import multer from 'multer';
import env from '../config/env.js';

export default function errorMiddleware(err, req, res, _next) {
  const status = err.status || 500;
  const isProd = env.NODE_ENV === 'production';

  // Log error
  console.error('Error:', {
    url: req.originalUrl,
    method: req.method,
    message: err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });

  // Multer errors
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File too large';
    else if (err.code === 'LIMIT_FILE_COUNT') message = 'Too many files uploaded';
    else if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Unexpected file field';

    return res.status(400).json({ success: false, message });
  }

  // Custom file filter error
  if (err.message === 'Invalid file type') {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only images and PDFs are allowed.',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongo duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value',
      field: Object.keys(err.keyValue),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // Default error
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isProd ? {} : { stack: err.stack }),
  });
}