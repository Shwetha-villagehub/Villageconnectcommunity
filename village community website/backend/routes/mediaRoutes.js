import express from 'express';
import multer from 'multer';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Media from '../models/Media.js';
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
const mediaDir = ensureDir(path.join(uploadRoot, 'media'));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, ensureDir(mediaDir)),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage });

router.get('/', async (_req, res) => {
  if (sendIfDatabaseUnavailable(res, [])) return;
  res.json(await Media.find().sort({ createdAt: -1 }));
});

router.post('/upload', requireDatabase, upload.single('media'), async (req, res) => {
  const mediaUrl = (req.body.mediaUrl || '').trim();
  if (!req.file && !mediaUrl) {
    return res.status(400).json({ message: 'Provide a media file or a public media URL' });
  }

  const isVideo =
    req.file?.mimetype?.startsWith('video/') ||
    req.body.type === 'video' ||
    /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);
  const media = await Media.create({
    type: isVideo ? 'video' : 'image',
    url: req.file ? `/public/uploads/media/${req.file.filename}` : mediaUrl,
    title: req.body.title || req.file?.originalname || 'Community Media',
    description: req.body.description || '',
  });
  res.status(201).json({ message: 'Media uploaded successfully', media });
});

export default router;
