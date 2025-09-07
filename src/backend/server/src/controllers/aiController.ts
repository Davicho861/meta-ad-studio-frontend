import { Request, Response } from 'express';

export const generateVideoGrok = async (req: Request, res: Response) => {
  try {
    // Simulate a successful video generation response from xAI Grok API
    const videos = [
      { id: 1, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { id: 2, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ];
    res.status(200).json({
      success: true,
      message: 'Videos generated successfully using xAI Grok API.',
      videos: videos,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
