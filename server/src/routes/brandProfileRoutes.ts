import { Router } from 'express';
import { getBrandProfile, upsertBrandProfile } from '../controllers/brandProfileController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(protect, getBrandProfile)
  .post(protect, upsertBrandProfile);

export default router;
