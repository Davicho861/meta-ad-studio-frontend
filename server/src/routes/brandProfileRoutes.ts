import { Router } from 'express';
import { getBrandProfile, upsertBrandProfile } from '../controllers/brandProfileController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(authMiddleware, getBrandProfile)
  .post(authMiddleware, upsertBrandProfile);

export default router;
