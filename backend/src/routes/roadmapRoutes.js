import express from 'express';
import { getOrCreateRoadmap, updateSkillStatus, toggleMilestone } from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getOrCreateRoadmap);
router.put('/skill-status', updateSkillStatus);
router.put('/milestone-toggle', toggleMilestone);

export default router;
