import { Router } from 'express';
import {
  getDashboard,
  logHeartRate,
  logSteps,
  getDailyMetrics,
  logDailyMetrics,
} from '../controllers/metricsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/dashboard', getDashboard);
router.post('/heart-rate', logHeartRate);
router.post('/steps', logSteps);
router.get('/daily', getDailyMetrics);
router.post('/daily', logDailyMetrics);

export default router;
