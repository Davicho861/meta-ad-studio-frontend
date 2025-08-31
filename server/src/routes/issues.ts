import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();
const router = Router();

router.post('/', authMiddleware, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const issue = await prisma.issue.create({
      data: { ...req.body, createdById: req.user.uid },
    });
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
