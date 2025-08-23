import { Router } from 'express';
import { generateVideo, generateAdWithGemini, getCreations } from '../controllers/videoController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/generate-video', generateVideo);
router.post('/generate-ad', protect, generateAdWithGemini);
router.get('/creations', protect, getCreations);

export default router;
