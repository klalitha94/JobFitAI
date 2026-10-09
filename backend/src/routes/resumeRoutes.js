import express from 'express';
import { uploadAndParseResume, getMyResume, updateParsedResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', uploadResume.single('resume'), uploadAndParseResume);
router.get('/my-resume', getMyResume);
router.put('/update', updateParsedResume);

export default router;
