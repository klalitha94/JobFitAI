import express from 'express';
import {
  getMyApplications,
  saveOrApplyJob,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyApplications);
router.post('/', saveOrApplyJob);
router.put('/:id', updateApplicationStatus);
router.delete('/:jobId', deleteApplication);

export default router;
