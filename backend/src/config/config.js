import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobfitai';
const isAtlasUri = mongoUri.startsWith('mongodb+srv://');

export const config = {
  port: process.env.PORT || 5000,
  mongoUri,
  isAtlasUri,
  jwtSecret: process.env.JWT_SECRET || 'jobfitai_super_secret_jwt_key_2026',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  nodeEnv: process.env.NODE_ENV || 'development'
};
