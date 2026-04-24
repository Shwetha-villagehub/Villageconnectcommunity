import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.MONGO_URL ||
  'mongodb://127.0.0.1:27017/villagecommunity';

const FALLBACK_MONGODB_URI = 'mongodb://127.0.0.1:27017/villagecommunity';

const mongooseOptions = {
  maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 10,
  minPoolSize: process.env.NODE_ENV === 'production' ? 10 : 2,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  maxIdleTimeMS: process.env.NODE_ENV === 'production' ? 600000 : 60000,
  retryWrites: true,
  retryReads: true,
  w: 'majority',
  family: 4,
  appName: 'VillageCommunity',
};

let isConnected = false;
let currentURI = MONGODB_URI;
let lastConnectionError = null;

const handleConnectionError = (error) => {
  console.error('MongoDB connection error:');

  const isAtlas = currentURI.includes('mongodb+srv') || currentURI.includes('atlas');
  const connectionType = isAtlas ? 'MongoDB Atlas' : 'Local MongoDB';

  if (error.message.includes('URI malformed')) {
    console.error(`   - URI malformed: ${connectionType}`);
    console.error('   - URL-encode special characters in username/password');
  } else if (error.message.includes('ENOTFOUND')) {
    console.error(`   - Cannot resolve hostname: ${connectionType}`);
  } else if (error.message.includes('authentication failed')) {
    console.error(`   - Authentication failed: ${connectionType}`);
  } else if (error.message.includes('ECONNREFUSED')) {
    console.error(`   - Connection refused: ${connectionType}`);
    console.error('   - Start MongoDB locally or update MONGODB_URI');
  } else if (error.message.includes('connect ETIMEDOUT')) {
    console.error('   - Connection timeout');
  } else {
    console.error(`   - ${error.message}`);
  }
};

const setupConnectionListeners = () => {
  const conn = mongoose.connection;

  conn.on('connected', () => {
    console.log('MongoDB connected event fired');
  });

  conn.on('disconnected', () => {
    console.warn('MongoDB disconnected');
    isConnected = false;
  });

  conn.on('error', (error) => {
    lastConnectionError = error;
    console.error('MongoDB runtime error:', error.message);
  });

  conn.once('open', () => {
    console.log('MongoDB connection opened');
  });
};

export const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB already connected');
    return mongoose.connection;
  }

  try {
    await mongoose.connect(currentURI, mongooseOptions);

    isConnected = true;
    lastConnectionError = null;

    const conn = mongoose.connection;

    console.log('MongoDB connected successfully');
    console.log(
      `   - Connection: ${currentURI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'}`
    );
    console.log(`   - Host: ${conn.host}`);
    console.log(`   - Database: ${conn.name}`);
    console.log(
      `   - Connection Pool: min=${mongooseOptions.minPoolSize}, max=${mongooseOptions.maxPoolSize}`
    );

    setupConnectionListeners();
    return conn;
  } catch (error) {
    isConnected = false;
    lastConnectionError = error;

    if (
      currentURI === MONGODB_URI &&
      MONGODB_URI !== FALLBACK_MONGODB_URI &&
      error.message.includes('authentication failed')
    ) {
      console.warn('Atlas authentication failed, trying local MongoDB...');
      currentURI = FALLBACK_MONGODB_URI;
      await mongoose.connection.close();
      return connectDB();
    }

    handleConnectionError(error);
    return null;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected gracefully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

export const isDatabaseAvailable = () => isConnected && mongoose.connection.readyState === 1;

export const getLastConnectionError = () => lastConnectionError?.message || null;

export const healthCheck = async () => {
  if (!isDatabaseAvailable() || !mongoose.connection?.db) {
    return {
      status: 'disconnected',
      error: getLastConnectionError() || 'Database connection is not available',
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const latency = Date.now() - startTime;

    return {
      status: 'connected',
      latency: `${latency}ms`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

export const getConnectionStats = () => {
  const client = mongoose.connection?.getClient?.();
  const topology = client?.topology;

  if (!topology) {
    return {
      state: isConnected ? 'connected' : 'disconnected',
      poolSize: mongooseOptions.maxPoolSize,
      minPoolSize: mongooseOptions.minPoolSize,
      environment: process.env.NODE_ENV || 'development',
      currentUri: currentURI,
      lastError: getLastConnectionError(),
    };
  }

  return {
    state: topology.s.state,
    poolSize: mongooseOptions.maxPoolSize,
    minPoolSize: mongooseOptions.minPoolSize,
    environment: process.env.NODE_ENV || 'development',
    currentUri: currentURI,
    lastError: getLastConnectionError(),
  };
};

export default {
  connectDB,
  disconnectDB,
  getConnectionStats,
  getLastConnectionError,
  healthCheck,
  isDatabaseAvailable,
};
