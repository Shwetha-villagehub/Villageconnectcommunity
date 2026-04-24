import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireDatabase } from '../middleware/db.js';

const router = express.Router();
const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret_change_me', {
    expiresIn: '7d',
  });
const sanitize = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

router.post('/register', requireDatabase, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'User already exists with this email' });

    const hashed = await bcrypt.hash(password, 10);
    const userCount = await User.countDocuments();
    const user = await User.create({
      username,
      email,
      password: hashed,
      role: userCount === 0 ? 'admin' : 'user',
    });

    res.status(201).json({ token: createToken(user), user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

router.post('/login', requireDatabase, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ token: createToken(user), user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed' });
  }
});

router.post('/logout', (_req, res) => res.json({ message: 'Logged out successfully' }));

export default router;
