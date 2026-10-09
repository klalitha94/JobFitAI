import express from 'express';
import { getJobMatchAnalysis, getTopRecommendations } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/recommendations', getTopRecommendations);
router.get('/job/:jobId', getJobMatchAnalysis);

export default router;
