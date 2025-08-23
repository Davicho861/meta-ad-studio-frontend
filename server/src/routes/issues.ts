import { Router, Request, Response } from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  getBacklogIssues,
} from '../services/issues';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Get all issues
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { filter, search } = req.query;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (filter === 'assigned-to-me') {
      where.assigneeId = req.user!.id;
    } else if (filter === 'team-work') {
      // Assuming team information is available on the user object
      where.teamId = req.user!.teamId;
    } else if (filter === 'due-this-week') {
      const today = new Date();
      const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      where.dueDate = { lte: nextWeek };
    }

    const issues = await getIssues(where);
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get backlog issues
router.get('/backlog', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId, dueThisWeek } = req.query;
    const issues = await getBacklogIssues({
      projectId: projectId as string,
      dueThisWeek: dueThisWeek === 'true',
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch backlog issues' });
  }
});

// Get team issues
// router.get('/team', authMiddleware, async (req: Request, res: Response) => {
//   try {
//     const { teamId } = req.query;
//     if (!teamId) {
//       return res.status(400).json({ error: 'Team ID is required' });
//     }
//     const issues = await getTeamIssues(teamId as string);
//     res.json(issues);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch team issues' });
//   }
// });

// Get single issue
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const issue = await getIssueById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
});

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'In Review', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High', 'Highest']),
  assigneeId: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
});

// Create issue (authenticated)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validatedData = issueSchema.parse(req.body);
    const issue = await createIssue(validatedData, req.user!.id);
    res.status(201).json(issue);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.format() });
    }
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// Update issue (authenticated)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validatedData = issueSchema.partial().parse(req.body);
    const issue = await updateIssue(req.params.id, validatedData, req.user!.id);
    res.json(issue);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.format() });
    }
    res.status(500).json({ error: 'Failed to update issue' });
  }
});

const statusSchema = z.object({
  status: z.enum(['To Do', 'In Progress', 'In Review', 'Done']),
});

// Update issue status (authenticated)
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validatedData = statusSchema.parse(req.body);
    const issue = await updateIssueStatus(req.params.id, validatedData.status);
    res.json(issue);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.format() });
    }
    res.status(500).json({ error: 'Failed to update issue status' });
  }
});

// Delete issue (authenticated)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await deleteIssue(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete issue' });
  }
});

export default router;
