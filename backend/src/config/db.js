import mongoose from 'mongoose';
import { config } from './config.js';

let isConnected = false;
let isMemoryFallback = false;
let lastError = null;

const redactMongoUri = (uri) => {
  try {
    const normalized = uri.replace(/^mongodb\+srv:\/\//, 'https://').replace(/^mongodb:\/\//, 'http://');
    const parsed = new URL(normalized);
    const protocol = uri.startsWith('mongodb+srv://') ? 'mongodb+srv' : 'mongodb';
    const dbName = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : '/(default)';
    return `${protocol}://****@${parsed.host}${dbName}`;
  } catch {
    return config.isAtlasUri ? 'mongodb+srv://****@<redacted>' : 'mongodb://****@<redacted>';
  }
};

const resolveDbName = (uri) => {
  try {
    const normalized = uri.replace(/^mongodb\+srv:\/\//, 'https://').replace(/^mongodb:\/\//, 'http://');
    const parsed = new URL(normalized);
    const fromPath = parsed.pathname?.replace(/^\//, '').split('/')[0];
    if (fromPath) return fromPath;
  } catch {
    // URI parse can fail if password has unencoded characters
  }
  return 'jobfitai';
};

export const connectDB = async () => {
  lastError = null;
  const dbName = resolveDbName(config.mongoUri);

  try {
    console.log(`[Database] Attempting connection to: ${redactMongoUri(config.mongoUri)}`);

    mongoose.set('strictQuery', false);
    await mongoose.connect(config.mongoUri, {
      dbName,
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    });

    await mongoose.connection.db.admin().command({ ping: 1 });

    isConnected = true;
    isMemoryFallback = false;
    console.log(`[Database] MongoDB Atlas connected successfully (db: ${dbName}).`);
  } catch (error) {
    lastError = error.message;
    isConnected = false;
    isMemoryFallback = true;

    console.warn(`[Database] Notice: Could not connect to remote MongoDB Atlas cluster (${error.message}).`);
    console.warn('[Database] Activated zero-crash In-Memory fallback store.');
    console.warn('[Database] Tip: To connect to MongoDB Atlas, add your IP (or 0.0.0.0/0) in MongoDB Atlas -> Network Access -> IP Access List.');
  }
};

export const getDbStatus = () => ({
  isConnected,
  isMemoryFallback,
  provider: config.isAtlasUri ? 'atlas' : 'local-or-default',
  uri: config.mongoUri ? 'Configured' : 'Default',
  lastError: isConnected ? null : lastError,
});
