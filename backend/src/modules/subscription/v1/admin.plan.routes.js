import { Router } from 'express';
import authMiddleware  from '../../../middlewares/auth.middleware.js';
import checkPermission from '../../../middlewares/check-permission.middleware.js';
import validate        from '../../../middlewares/validate.middleware.js';
import { createPlanSchema, updatePlanSchema } from './plan.schema.js';
import {
  listPlans, getStats, getPlan, createPlan, updatePlan, toggleStatus, deletePlan,
} from './plan.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(checkPermission('plans'));

router.get('/stats', getStats);
router.get('/',      listPlans);
router.post('/',     validate(createPlanSchema), createPlan);
router.get('/:id',   getPlan);
router.put('/:id',   validate(updatePlanSchema), updatePlan);
router.patch('/:id/status', toggleStatus);
router.delete('/:id', deletePlan);

export default router;