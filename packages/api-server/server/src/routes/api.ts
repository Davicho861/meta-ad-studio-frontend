import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { collectDefaultMetrics, register } from 'prom-client';
import { generateVideoGrok } from '../controllers/aiController';
import animateController from '../controllers/animateController';

collectDefaultMetrics();

const router = Router();

router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

router.get('/data', (req, res) => {
  res.json({ message: 'Success', data: [1, 2, 3] });
});

router.post('/v1/generate-video', authMiddleware, (req, res) => {
  // Simulate a successful video generation response
  const videos = [
    { id: 1, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 2, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  ];
  res.status(200).json({
    success: true,
    message: 'Videos generated successfully.',
    videos: videos,
  });
});

router.post('/v1/generate-video-grok', authMiddleware, generateVideoGrok);

// Endpoint to request animation of an image -> returns jobId
router.post('/v1/animate-image', authMiddleware, animateController.animateImage);
router.get('/v1/animate-image/status/:jobId', authMiddleware, animateController.getJobStatus);

export default router;
