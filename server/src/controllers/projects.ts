import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        createdById: userId,
      },
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
