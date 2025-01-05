import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { users, type NewUser, type Role, isValidRole } from '../db/schema';
import { auth, AuthRequest, checkRole } from '../middleware/auth';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// Create user (protected, admin only)
router.post(
  '/',
  auth,
  checkRole(['admin']),
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
    body('role')
      .optional()
      .custom((value) => {
        if (!isValidRole(value)) {
          throw new Error('Invalid role. Must be either "admin" or "user"');
        }
        return true;
      }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;
      const role = (req.body.role || 'user') as Role;

      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUserData: NewUser = {
        email,
        password: hashedPassword,
        name,
        role,
      };

      const [newUser] = await db.insert(users).values(newUserData).returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all users (protected)
router.get('/', auth, checkRole(['admin']), async (req: AuthRequest, res) => {
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
router.get(
  '/:id',
  auth,
  checkRole(['admin', 'user']),
  async (req: AuthRequest, res) => {
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
  }
);

// Update user (protected)
router.put(
  '/:id',
  auth,
  checkRole(['admin']),
  async (req: AuthRequest, res) => {
    try {
      const { email } = req.body;

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
  }
);

// Delete user (protected)
router.delete(
  '/:id',
  auth,
  checkRole(['admin']),
  async (req: AuthRequest, res) => {
    try {
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
  }
);

export default router;
