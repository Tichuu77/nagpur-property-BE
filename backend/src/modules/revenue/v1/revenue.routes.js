import { Router } from 'express';
import authMiddleware  from '../../../middlewares/auth.middleware.js';
import checkPermission from '../../../middlewares/check-permission.middleware.js';
import {
  getStats,
  getMonthlyRevenue,
  getSubscriptionsByPlan,
  getPlanBreakdown,
  getTransactions,
} from './revenue.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(checkPermission('revenue'));

// All GET — analytics / read-only
router.get('/stats',         getStats);
router.get('/monthly',       getMonthlyRevenue);
router.get('/by-plan',       getSubscriptionsByPlan);
router.get('/plan-breakdown',getPlanBreakdown);
router.get('/transactions',  getTransactions);

export default router;