import { Router } from 'express';
import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} from '../controllers/plansController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getPlans);
router.post('/', createPlan);
router.get('/:id', getPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;
