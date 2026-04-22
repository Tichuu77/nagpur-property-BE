import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis.js';

/**
 * BullMQ Queue — uses its own Redis connection.
 * Do NOT share this connection with the Worker (BullMQ requirement).
 */
const mailQueue = new Queue('mail', {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100,  // keep last 100 completed jobs for debugging
    removeOnFail: 200,       // keep last 200 failed jobs for inspection
  },
});

mailQueue.on('error', (err) => {
  console.error('Mail queue error:', err.message);
});

export default mailQueue;