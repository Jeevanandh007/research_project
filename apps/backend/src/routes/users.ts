import { Router } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { auth, AuthRequest } from '../middleware/auth';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// Get all users (protected)
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);

    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (protected)
router.get('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, parseInt(req.params.id)));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (protected)
router.put('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const { email } = req.body;

    // Only allow users to update their own profile
    if (req.user?.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const [updatedUser] = await db
      .update(users)
      .set({ email })
      .where(eq(users.id, parseInt(req.params.id)))
      .returning({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (protected)
router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    // Only allow users to delete their own profile
    if (req.user?.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, parseInt(req.params.id)))
      .returning({ id: users.id });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
