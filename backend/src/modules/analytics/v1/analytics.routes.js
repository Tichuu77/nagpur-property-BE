import { Router } from 'express';
import authMiddleware  from '../../../middlewares/auth.middleware.js';
import checkPermission from '../../../middlewares/check-permission.middleware.js';
import {
  getOverview,
  getUserActivity,
  getTrafficSources,
  getMonthlyGrowth,
  getTopBrokers,
  getPropertiesByLocation,
  getPropertyTypeDistribution,
} from './analytics.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(checkPermission('analytics'));

router.get('/overview',                  getOverview);
router.get('/user-activity',             getUserActivity);
router.get('/traffic-sources',           getTrafficSources);
router.get('/monthly-growth',            getMonthlyGrowth);
router.get('/top-brokers',               getTopBrokers);
router.get('/properties-by-location',    getPropertiesByLocation);
router.get('/property-type-distribution', getPropertyTypeDistribution);

export default router;