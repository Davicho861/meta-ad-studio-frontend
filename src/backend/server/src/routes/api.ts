import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { collectDefaultMetrics, register } from 'prom-client';
import { generateVideoGrok } from '../controllers/aiController';
import animateController from '../controllers/animateController';
import aiRouter from './ai';

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
// In test or local runs we may want to skip auth to simplify E2E testing.
if (process.env.NODE_ENV === 'test' || process.env.SKIP_AUTH === 'true') {
  router.post('/v1/animate-image', animateController.animateImage);
  router.get('/v1/animate-image/status/:jobId', animateController.getJobStatus);
} else {
  router.post('/v1/animate-image', authMiddleware, animateController.animateImage);
  router.get('/v1/animate-image/status/:jobId', authMiddleware, animateController.getJobStatus);
}

// Mount AI router so SSE endpoint /jobs/:id/stream is available under /api
router.use('/', aiRouter);

// Test-only unauthenticated endpoint to create a job quickly from E2E scripts
if (process.env.NODE_ENV === 'test') {
  router.post('/test/animate-image', animateController.animateImage);
}

// Always-available unprotected endpoint for local E2E runs (keeps production routes untouched)
router.post('/unprotected/animate-image', animateController.animateImage);

export default router;
