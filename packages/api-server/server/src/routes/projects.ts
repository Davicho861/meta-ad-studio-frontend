import express from 'express';
import { createProject } from '../controllers/projects';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createProject);

export default router;
