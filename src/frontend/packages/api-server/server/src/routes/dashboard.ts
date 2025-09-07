import { Router } from 'express';

const router = Router();

// Mock data for now
const autonomyMetrics = {
  tasksCompleted: 120,
  apiCosts: 45.67,
};

const reasoningLogs = [
  { prompt: 'Generate a new component', reasoningEffort: 'high' },
  { prompt: 'Fix a bug in the login form', reasoningEffort: 'medium' },
];

const monetizationMetrics = {
  revenue: 1200,
  activeUsers: 89,
};

router.get('/autonomy-metrics', (req, res) => {
  res.json(autonomyMetrics);
});

router.get('/reasoning-logs', (req, res) => {
  res.json(reasoningLogs);
});

router.get('/monetization-metrics', (req, res) => {
  res.json(monetizationMetrics);
});

export default router;
