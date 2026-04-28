import { Router } from 'express';
import { getWeeklyStats, getMonthlyStats, getOverallStats } from '../controllers/statsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/weekly', getWeeklyStats);
router.get('/monthly', getMonthlyStats);
router.get('/overall', getOverallStats);

export default router;
