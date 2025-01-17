import { Queue } from 'bullmq';

export const predictionQueue = new Queue('prediction-queue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});
