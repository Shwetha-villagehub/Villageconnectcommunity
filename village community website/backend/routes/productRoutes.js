import express from 'express';
import multer from 'multer';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDatabase, sendIfDatabaseUnavailable } from '../middleware/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultUploadRoot = process.env.VERCEL
  ? path.join(os.tmpdir(), 'villagecommunity', 'uploads')
  : path.join(__dirname, '..', 'public', 'uploads');
const uploadRoot = process.env.UPLOAD_DIR || defaultUploadRoot;
const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};
const productDir = ensureDir(path.join(uploadRoot, 'products'));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, ensureDir(productDir)),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage });

router.get('/', async (_req, res) => {
  if (sendIfDatabaseUnavailable(res, [])) return;

  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.post('/', requireAuth, requireDatabase, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = (req.body.imageUrl || req.body.image || '').trim();
    if (!req.file && !imageUrl) {
      return res.status(400).json({ message: 'Provide a product image file or an image URL' });
    }

    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      category: req.body.category,
      sellerName: req.body.sellerName,
      image: req.file ? `/public/uploads/products/${req.file.filename}` : imageUrl,
    });
    res.status(201).json({ message: 'Product listed successfully', product });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create product' });
  }
});

router.get('/:id', async (req, res) => {
  if (sendIfDatabaseUnavailable(res, null)) return;

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.put('/:id', requireAuth, requireDatabase, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

router.delete('/:id', requireAuth, requireDatabase, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

export default router;
