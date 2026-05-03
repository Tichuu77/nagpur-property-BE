import { Router } from 'express';
import authMiddleware       from '../../../middlewares/auth.middleware.js';
import checkPermission      from '../../../middlewares/check-permission.middleware.js';
import validate             from '../../../middlewares/validate.middleware.js';
import {
  createUser,
  listUsers,
  getStats,
  getUser,
  updateUser,
  toggleStatus,
  deleteUser,
  getPropLeadPlanQueryStats,
} from './user.controller.js';
import { createUserSchema, updateUserSchema } from './user.schema.js';
import userPlanRoutes from './user-plan.routes.js';

const router = Router();

// All user routes require a valid JWT
router.use(authMiddleware);

// checkPermission maps HTTP method → read / write / delete
router.use(checkPermission('users'));

// ── Stats — must come BEFORE /:id ──────────────────────────────────────────
router.get('/stats', getStats);

// ── Collection ────────────────────────────────────────────────────────────────
router.get('/',  listUsers);
router.post('/', validate(createUserSchema), createUser);

// ── User plan sub-routes ───────────────────────────────────────────────────────
router.use('/:userId/plans', userPlanRoutes);

// user properties , leads , enquiries and plans count stats
router.get('/:id/prop-lead-plan-query-stats', getPropLeadPlanQueryStats);

// ── Single document ───────────────────────────────────────────────────────────
router.get('/:id',          getUser);
router.put('/:id',          validate(updateUserSchema), updateUser);
router.patch('/:id/status', toggleStatus);
router.delete('/:id',       deleteUser);

export default router;