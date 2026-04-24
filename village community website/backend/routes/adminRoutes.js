import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { requireDatabase, sendIfDatabaseUnavailable } from '../middleware/db.js';

const router = express.Router();
router.use(requireAuth, requireAdmin);

router.get('/dashboard', (_req, res) => res.json({ message: 'Admin dashboard ready' }));

router.get('/users', async (_req, res) => {
  if (sendIfDatabaseUnavailable(res, [])) return;

  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

router.delete('/users/:id', requireDatabase, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted successfully' });
});

router.get('/products', async (_req, res) => {
  if (sendIfDatabaseUnavailable(res, [])) return;

  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.delete('/products/:id', requireDatabase, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

export default router;
