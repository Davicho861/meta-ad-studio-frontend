import { Request, Response } from 'express';
import { videoQueue } from '../lib/queue';

export const generateVideo = async (req: Request, res: Response) => {
  try {
    const { sceneDescription, userId } = req.body;

    if (!sceneDescription) {
      return res.status(400).json({ message: 'sceneDescription is required' });
    }

    // Enqueue the job and persist job id for client to subscribe
    const job = await videoQueue.add('generate', { sceneDescription, userId }, { removeOnComplete: true, removeOnFail: false });

    return res.status(202).json({ jobId: job.id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: 'An unknown error occurred' });
    }
  }
};