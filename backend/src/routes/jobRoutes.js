import express from 'express';
import { listJobs, getSingleJob, getJobLocationsAndStats } from '../controllers/jobController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, listJobs);
router.get('/stats', getJobLocationsAndStats);
router.get('/:id', optionalAuth, getSingleJob);

export default router;
