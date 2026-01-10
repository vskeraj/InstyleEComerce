import { Router } from 'express';

const router = Router();

// TODO: Implement order routes
router.get('/', (req, res) => {
  res.json({ message: 'Order service is running' });
});

export default router;
