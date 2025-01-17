/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import machineDataRoutes from './routes/machine-data';
import { predictionWorker } from './queues/prediction.worker';

dotenv.config();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Initialize worker
predictionWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

predictionWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

const app = express();

// Logging middleware
app.use(morgan('dev'));

// CORS configuration
app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/machine-data', machineDataRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
