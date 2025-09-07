import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Placeholder for roadmap service functions
const getRoadmap = async (projectId: string) => {
  console.log('Fetching roadmap for project:', projectId);
  return { projectId, epics: [] };
};

// Get roadmap for a project
router.get('/:projectId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const roadmap = await getRoadmap(req.params.projectId);
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

export default router;
