import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import mailService from '../services/mail.service.js';

const mailWorker = new Worker(
  'mail',
  async (job) => {
    const { to, subject, html } = job.data;
    await mailService.send({ to, subject, html });
  },
  { connection: redis }
);

mailWorker.on('failed', (job, err) => {
  console.error(`Mail job ${job?.id} failed:`, err.message);
});

export default mailWorker;