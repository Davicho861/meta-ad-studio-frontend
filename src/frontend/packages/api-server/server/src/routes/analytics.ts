import { Router } from 'express';
import Mixpanel from 'mixpanel';
import { developmentAgent } from '../services/developmentAgent';

const router = Router();
const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN!);

router.post('/track', (req, res) => {
  const { event, properties } = req.body;
  mixpanel.track(event, properties);
  res.status(200).send('Event tracked');
});

router.post('/generate-tracking', async (req, res) => {
  const { platform } = req.body; // platform can be 'google-analytics' or 'mixpanel'
  const featureDescription = `Configure user tracking in React with ${platform}. Generate the necessary code to track page views and custom events.`;
  const openapiContent = ''; // No openapi content for this task
  const reasoning_effort = 'high';

  try {
    const code = await developmentAgent(featureDescription, openapiContent, reasoning_effort);
    res.json({ code });
  } catch (error) {
    res.status(500).json({ error: `Failed to generate ${platform} tracking code` });
  }
});

export default router;
