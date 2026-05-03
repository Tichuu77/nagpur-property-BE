import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import checkPermission from '../../../middlewares/check-permission.middleware.js';
import {
  listUserPlans,
  createUserPlan,
  updateUserPlan,
  deleteUserPlan,
} from './user-plan.controller.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);
router.use(checkPermission('customers'));

router.get('/',    listUserPlans);
router.post('/',   createUserPlan);
router.put('/:planRecordId',    updateUserPlan);
router.delete('/:planRecordId', deleteUserPlan);

export default router;