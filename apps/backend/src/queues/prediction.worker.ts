import { Worker } from 'bullmq';
import axios from 'axios';
import { db } from '../db';
import { machineData } from '../db/schema';
import { eq } from 'drizzle-orm';

const PREDICT_API_URL =
  process.env.PREDICT_API_URL || 'http://13.202.159.27:80/predict';

export const predictionWorker = new Worker(
  'prediction-queue',
  async (job) => {
    try {
      console.log('job', job);
      const {
        id,
        type,
        airTemperature,
        processTemperature,
        rotationalSpeed,
        torque,
        toolWear,
      } = job.data;

      const response = await axios.post(PREDICT_API_URL, {
        type,
        air_temp: airTemperature,
        process_temp: processTemperature,
        rotational_speed: rotationalSpeed,
        torque,
        tool_wear: toolWear,
      });

      const { prediction } = response.data;

      // Update the machine status and prediction status
      await db
        .update(machineData)
        .set({
          machineStatus: prediction,
          predictionStatus: 1, // completed
        })
        .where(eq(machineData.id, id));
    } catch (error) {
      console.error('Prediction job failed:', error);

      // Update prediction status to exception
      await db
        .update(machineData)
        .set({
          predictionStatus: 2, // exception
        })
        .where(eq(machineData.id, job.data.id));

      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  }
);
