import Redis from 'ioredis';
import env from './env.js';

let redis;

const initRedis = () => {
  try {
    if (!redis) {
      redis = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: null,

        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          console.warn(`Redis retry attempt #${times}, retrying in ${delay}ms`);
          return delay;
        },

        reconnectOnError: (err) => {
          const targetErrors = ['READONLY', 'ECONNRESET'];
          if (targetErrors.some(e => err.message.includes(e))) {
            return true;
          }
          return false;
        },
      });

      console.log('Redis initialized');
    }

    return redis;
  } catch (error) {
    console.error('Redis init error:', error.message);
    process.exit(1);
  }
};

// Connection listeners
const setupRedisListeners = () => {
  if (!redis) return;

  redis.on('connect', () => {
    console.log('Redis connected');
  });

  redis.on('ready', () => {
    console.log('Redis ready');
  });

  redis.on('error', (err) => {
    console.error('Redis error:', err);
  });

  redis.on('close', () => {
    console.warn('Redis connection closed');
  });

  redis.on('reconnecting', () => {
    console.log('Redis reconnecting...');
  });
};

// Initialize immediately (optional)
const client = initRedis();
setupRedisListeners();

export default client;