import { Router } from 'express';
import userRoutes from './userRoutes.js';
import s3Routes from './s3Routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/users', userRoutes);
router.use('/s3', s3Routes);

export default router;
