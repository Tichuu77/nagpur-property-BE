import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import  {apiLimiter} from './middlewares/rate-limit.middleware.js';
import apiRouter from './api/index.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// Security
app.use(helmet());

// CORS  
app.use(cors({
  origin: '*', 
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Performance
app.use(compression());

// Rate limiting
app.use(apiLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorMiddleware);

export default app;