import { Router } from 'express';
import { db } from '../db';
import { machineData, type NewMachineData } from '../db/schema';
import { desc } from 'drizzle-orm';
import { auth, AuthRequest } from '../middleware/auth';
import { predictionQueue } from '../queues/prediction.queue';
import { z } from 'zod';

const router = Router();

const machineDataSchema = z.object({
  timestamp: z.string().datetime(),
  airTemperature: z.number(),
  processTemperature: z.number(),
  rotationalSpeed: z.number().int(),
  torque: z.number(),
  toolWear: z.number().int(),
  productId: z.string(),
  type: z.number().int(),
  twf: z.number().int(),
  hdf: z.number().int(),
  pwf: z.number().int(),
  osf: z.number().int(),
  rnf: z.number().int(),
});

// Data ingestion endpoint
router.post('/', async (req: AuthRequest, res) => {
  try {
    const payload = machineDataSchema.parse(req.body);

    const insertData: NewMachineData = {
      timestamp: payload.timestamp,
      airTemperature: payload.airTemperature.toString(),
      processTemperature: payload.processTemperature.toString(),
      rotationalSpeed: payload.rotationalSpeed,
      torque: payload.torque.toString(),
      toolWear: payload.toolWear,
      productId: payload.productId,
      type: payload.type,
      twf: payload.twf,
      hdf: payload.hdf,
      pwf: payload.pwf,
      osf: payload.osf,
      rnf: payload.rnf,
      machineStatus: 0,
      predictionStatus: 0,
    };

    const [insertedData] = await db
      .insert(machineData)
      .values(insertData)
      .returning();

    // Add to prediction queue
    await predictionQueue.add('predict', {
      id: insertedData.id,
      type: insertedData.type,
      airTemperature: insertedData.airTemperature,
      processTemperature: insertedData.processTemperature,
      rotationalSpeed: insertedData.rotationalSpeed,
      torque: insertedData.torque,
      toolWear: insertedData.toolWear,
    });

    res.status(201).json(insertedData);
  } catch (error) {
    console.error('Error ingesting machine data:', error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: 'Invalid data format', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest machine data
router.get('/latest', auth, async (req: AuthRequest, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 1;

    const latestData = await db
      .select()
      .from(machineData)
      .orderBy(desc(machineData.timestamp))
      .limit(limit);

    res.json(latestData);
  } catch (error) {
    console.error('Error fetching latest machine data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
