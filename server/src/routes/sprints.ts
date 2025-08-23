import { Router, Request, Response } from 'express';
import {
  createSprint,
  getSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
  assignIssuesToSprint,
  removeIssuesFromSprint,
} from '../services/sprints';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Get all sprints (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters = { projectId: req.query.projectId as string };
    const sprints = await getSprints(filters);
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sprints' });
  }
});

// Get single sprint (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const sprint = await getSprintById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ error: 'Sprint not found' });
    }
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sprint' });
  }
});

// Create sprint (authenticated)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const sprint = await createSprint(req.body, req.user!.id);
    res.status(201).json(sprint);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.format() });
    }
    res.status(500).json({ error: 'Failed to create sprint' });
  }
});

// Update sprint (authenticated)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const sprint = await updateSprint(req.params.id, req.body);
    res.json(sprint);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.format() });
    }
    res.status(500).json({ error: 'Failed to update sprint' });
  }
});

// Delete sprint (authenticated)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await deleteSprint(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sprint' });
  }
});

// Assign issues to sprint (authenticated)
router.post('/:id/issues', authMiddleware, async (req: Request, res: Response) => {
  try {
    const sprint = await assignIssuesToSprint(req.params.id, req.body.issueIds);
    res.json(sprint);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.format() });
    }
    res.status(500).json({ error: 'Failed to assign issues to sprint' });
  }
});

// Remove issues from sprint (authenticated)
router.delete('/:id/issues', authMiddleware, async (req: Request, res: Response) => {
  try {
    const sprint = await removeIssuesFromSprint(req.params.id, req.body.issueIds);
    res.json(sprint);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.format() });
    }
    res.status(500).json({ error: 'Failed to remove issues from sprint' });
  }
});

export default router;
