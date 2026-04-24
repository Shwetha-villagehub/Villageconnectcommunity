import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDatabaseAvailable } from '../config/mongodb.js';

export const requireAuth = async (req, res, next) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({
        message: 'Authentication is unavailable while the database is offline',
      });
    }

    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
