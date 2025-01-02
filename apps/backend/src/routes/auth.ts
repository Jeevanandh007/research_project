import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
        })
        .returning();

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1d',
      });

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({ message: 'Logged in successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;
