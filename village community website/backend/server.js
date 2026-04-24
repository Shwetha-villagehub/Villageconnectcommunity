import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import {
  connectDB,
  getConnectionStats,
  getLastConnectionError,
  healthCheck,
  isDatabaseAvailable,
} from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRoot =
  process.env.UPLOAD_DIR ||
  path.join(process.env.RENDER_DISK_ROOT || __dirname, 'public', 'uploads');
const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}
app.use('/public/uploads', express.static(uploadRoot));

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

const JobApplicationSchema = new mongoose.Schema({
  jobId: Number,
  jobTitle: String,
  fullName: String,
  phone: String,
  email: String,
  message: String,
  resumePath: String,
  appliedAt: { type: Date, default: Date.now },
});
const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/media', mediaRoutes);

app.get('/api/jobs', (_req, res) => {
  res.json([]);
});

app.get('/api/orders', (_req, res) => {
  res.json([]);
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/db-health', async (_req, res) => {
  res.json(await healthCheck());
});

app.get('/api/connection-stats', (_req, res) => {
  res.json(getConnectionStats());
});

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(uploadRoot, 'resumes');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadResume = multer({ storage: resumeStorage });

app.post('/api/jobs/apply', uploadResume.single('resume'), async (req, res) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({
        message: 'Job applications are temporarily unavailable because the database is offline',
        dbAvailable: false,
        error: getLastConnectionError(),
      });
    }

    const application = new JobApplication({
      ...req.body,
      resumePath: req.file ? `/public/uploads/resumes/${req.file.filename}` : null,
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/job-applications', async (_req, res) => {
  try {
    if (!isDatabaseAvailable()) {
      res.setHeader('X-Database-Available', 'false');
      res.setHeader('X-Database-Error', getLastConnectionError() || 'Database unavailable');
      return res.json([]);
    }

    const applications = await JobApplication.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: err.message });
  }
});

const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
      if (!isDatabaseAvailable()) {
        console.warn('Database is offline. Read-only fallback endpoints are enabled.');
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
  }
};

startServer();

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await mongoose.disconnect();
  process.exit(0);
});
