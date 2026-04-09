import multer from 'multer';

export default function errorMiddleware(err, req, res, _next) {
  const status = err.status || 500;

  // Log error
  console.error('Error:', {
    url: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: err.stack,
  });

  // Multer errors (VERY IMPORTANT)
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }

    return res.status(400).json({
      success: false,
      message,
    });
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
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value',
      field: Object.keys(err.keyValue),
    });
  }

  // Default error
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.stack,
  });
}