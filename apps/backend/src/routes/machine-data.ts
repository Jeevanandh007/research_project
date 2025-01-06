import { Router } from 'express';
import { db } from '../db';
import { machineData } from '../db/schema';
import { desc } from 'drizzle-orm';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

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
