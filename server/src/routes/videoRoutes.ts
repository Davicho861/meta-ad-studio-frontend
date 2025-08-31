import { Router } from 'express';
import { getVideos } from '../controllers/videoController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getVideos);

export default router;
