import { Router } from 'express';

const router = Router();

router.get('/data', (req, res) => {
  res.json({ message: 'Success', data: [1, 2, 3] });
});

export default router;
