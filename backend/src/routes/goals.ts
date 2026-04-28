import { Router } from 'express';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalProgress,
} from '../controllers/goalsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getGoals);
router.post('/', createGoal);
router.get('/progress', getGoalProgress);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
