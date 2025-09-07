import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';
import { updateIssueStatus } from '../services/issues';
import { body, validationResult } from 'express-validator';

const router = Router();

// Placeholder for kanban service functions
const getKanbanBoard = async (projectId: string) => {
  console.log('Fetching kanban board for project:', projectId);
  return { projectId, columns: [] };
};

// Get kanban board for a project
router.get('/:projectId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const board = await getKanbanBoard(req.params.projectId);
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch kanban board' });
  }
});

// Update issue status
router.put(
  '/issues/:issueId',
  authMiddleware,
  [body('status').notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { issueId } = req.params;
      const { status } = req.body;
      await updateIssueStatus(issueId, status);
      res.json({ message: 'Issue status updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update issue status' });
    }
  }
);

export default router;
