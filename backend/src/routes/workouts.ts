import { Router } from 'express';
import {
  getWorkouts,
  createWorkout,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutHistory,
} from '../controllers/workoutController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getWorkouts);
router.post('/', createWorkout);
router.get('/history', getWorkoutHistory);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;
