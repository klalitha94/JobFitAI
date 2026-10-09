import express from 'express';
import { generateInterviewKit, submitMockAnswer } from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate', generateInterviewKit);
router.post('/mock-answer', submitMockAnswer);

export default router;
