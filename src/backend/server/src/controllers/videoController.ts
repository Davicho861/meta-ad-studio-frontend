import { Response } from 'express';


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVideos = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const videos = await prisma.video.findMany({
      where: { userId: req.user.uid },
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
