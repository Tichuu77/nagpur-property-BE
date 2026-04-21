import { Queue } from 'bullmq';
import redis from '../config/redis.js';

const mailQueue = new Queue('mail', { connection: redis });

export default mailQueue;