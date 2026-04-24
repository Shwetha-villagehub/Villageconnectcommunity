import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Media from '../models/Media.js';
import { requireDatabase, sendIfDatabaseUnavailable } from '../middleware/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'public', 'uploads');
const mediaDir = path.join(uploadRoot, 'media');
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, mediaDir),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage });

router.get('/', async (_req, res) => {
  if (sendIfDatabaseUnavailable(res, [])) return;
  res.json(await Media.find().sort({ createdAt: -1 }));
});

router.post('/upload', requireDatabase, upload.single('media'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const isVideo = req.file.mimetype.startsWith('video/');
  const media = await Media.create({
    type: isVideo ? 'video' : 'image',
    url: `/public/uploads/media/${req.file.filename}`,
    title: req.body.title || req.file.originalname,
    description: req.body.description || '',
  });
  res.status(201).json({ message: 'Media uploaded successfully', media });
});

export default router;
