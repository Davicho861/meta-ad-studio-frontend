import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getCloudBuildClient } from '../services/gcp';

const router = express.Router();

router.get('/cloudbuild/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const client = await getCloudBuildClient();
    const [builds] = await client.listBuilds({ projectId: process.env.GCP_PROJECT_ID });
    res.json(builds);
  } catch (error: any) {
    res.status(500).json({ error: `Failed to fetch Cloud Build history: ${error.message}` });
  }
});

router.get('/project-management', authMiddleware, async (req: Request, res: Response) => {
  // Fetch from Firestore (assumed)
  res.json({ issues: [], sprints: [], milestones: [] }); // Placeholder
});

export default router;
