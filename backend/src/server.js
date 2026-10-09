import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { connectDB, getDbStatus } from './config/db.js';
import { initializeJobs } from './services/jobApiService.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: dbStatus.isConnected ? 'online' : (dbStatus.isMemoryFallback ? 'online-memory-fallback' : 'degraded'),
    appName: 'JobFit AI Backend',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    geminiConfigured: Boolean(config.geminiApiKey),
    model: config.geminiModel,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/applications', applicationRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Bootstrap Server
const startServer = async () => {
  try {
    await connectDB();
    await initializeJobs();

    const server = app.listen(config.port, () => {
      console.log(`===============================================`);
      console.log(`🚀 JobFit AI Backend running on port ${config.port}`);
      console.log(`📡 URL: http://localhost:${config.port}`);
      console.log(`🤖 Gemini AI Status: ${config.geminiApiKey ? 'Configured & Active' : 'Fallback Intelligent Heuristics Mode (Set GEMINI_API_KEY in .env)'}`);
      console.log(`===============================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${config.port} is already in use. Please choose another port via PORT env variable.`);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
