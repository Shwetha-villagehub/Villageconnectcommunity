import { getLastConnectionError, isDatabaseAvailable } from '../config/mongodb.js';

export const requireDatabase = (_req, res, next) => {
  if (isDatabaseAvailable()) {
    return next();
  }

  return res.status(503).json({
    message: 'Database is currently unavailable. Please try again later.',
    dbAvailable: false,
    error: getLastConnectionError(),
  });
};

export const sendIfDatabaseUnavailable = (res, fallbackData) => {
  if (isDatabaseAvailable()) {
    return false;
  }

  res.setHeader('X-Database-Available', 'false');
  res.setHeader('X-Database-Error', getLastConnectionError() || 'Database unavailable');
  res.json(fallbackData);
  return true;
};
