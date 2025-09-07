import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Placeholder for backlog service functions
const getBacklog = async (projectId: string) => {
  console.log('Fetching backlog for project:', projectId);
  return { projectId, issues: [] };
};

// Get backlog for a project
router.get('/:projectId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const backlog = await getBacklog(req.params.projectId);
    res.json(backlog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch backlog' });
  }
});

export default router;
