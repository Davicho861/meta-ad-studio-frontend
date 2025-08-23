import express from 'express';
import { createProject } from '../controllers/projects';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createProject);

export default router;
