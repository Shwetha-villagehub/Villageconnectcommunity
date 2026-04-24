import express from 'express';
import Category from '../models/Category.js';
import { requireDatabase, sendIfDatabaseUnavailable } from '../middleware/db.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  if (sendIfDatabaseUnavailable(res, [])) return;
  res.json(await Category.find().sort({ name: 1 }));
});

router.post('/', requireDatabase, async (req, res) => {
  res.status(201).json(await Category.create(req.body));
});

export default router;
