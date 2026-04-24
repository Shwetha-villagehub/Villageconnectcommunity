import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.get('/profile', requireAuth, (req, res) => res.json(req.user));
router.put('/profile', requireAuth, (req, res) => res.json({ message: 'Profile update endpoint ready', user: req.user }));
export default router;
