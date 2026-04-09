import dotenv from 'dotenv';
import path from 'path';

// Load correct env file
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

// Helper to require env variables
const required = (key, fallback) => {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }

  return value;
};

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: Number(process.env.PORT) || 4000,

  MONGO_URI: required(
    'MONGO_URI',
    process.env.NODE_ENV === 'development'
      ? 'mongodb://127.0.0.1:27017/nagpur-property'
      : null
  ),

  REDIS_URL: required(
    'REDIS_URL',
    process.env.NODE_ENV === 'development'
      ? 'redis://127.0.0.1:6379'
      : null
  ),

  JWT_SECRET: required(
    'JWT_SECRET',
    process.env.NODE_ENV === 'development'
      ? 'dev-secret-key'
      : null
  ),

 
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

export default env;