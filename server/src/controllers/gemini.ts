import { Request, Response } from 'express';
import { generateVideoService } from '../services/gemini';

export const generateVideo = async (req: Request, res: Response) => {
  try {
    const { sceneDescription } = req.body;

    if (!sceneDescription) {
      return res.status(400).json({ message: 'sceneDescription is required' });
    }

    const videoUrl = await generateVideoService(sceneDescription);

    if (!videoUrl) {
      return res.status(500).json({ message: 'Failed to generate video' });
    }

    res.status(200).json({ videoUrl });
  } catch (error: unknown) {
    console.error('Error generating video:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: 'An unknown error occurred' });
    }
  }
};