import rateLimit from 'express-rate-limit';

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },

 keyGenerator: (req) => {
    return ipKeyGenerator(req);  
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,

  message: {
    success: false,
    message: 'Too many attempts, please try again later.',
  },
});