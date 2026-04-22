import Redis from 'ioredis';
import env from './env.js';

/**
 * Create a new Redis connection.
 * BullMQ requires SEPARATE connections for Queue and Worker
 * (the worker blocks one connection with BRPOP).
 * Never share a single Redis instance between a Queue and a Worker.
 */
export function createRedisConnection() {
  if (!env.REDIS_URL) {
    throw new Error('REDIS_URL is not configured');
  }

  const client = new Redis(env.REDIS_URL.trim(), {
    // BullMQ requirement: must be null so the library can manage retries itself
    maxRetriesPerRequest: null,

    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 3000);
      console.warn(`Redis retry #${times} in ${delay}ms`);
      return delay;
    },

    reconnectOnError: (err) => {
      return ['READONLY', 'ECONNRESET'].some((e) => err.message.includes(e));
    },
  });

  client.on('connect', () => console.log('Redis connected'));
  client.on('ready', () => console.log('Redis ready'));
  client.on('error', (err) => console.error('Redis error:', err.message));
  client.on('close', () => console.warn('Redis connection closed'));

  return client;
}

// Default singleton for general use (e.g. caching, session — NOT for BullMQ worker)
let _defaultClient;

export function getRedis() {
  if (!_defaultClient) {
    _defaultClient = createRedisConnection();
  }
  return _defaultClient;
}

export default getRedis();