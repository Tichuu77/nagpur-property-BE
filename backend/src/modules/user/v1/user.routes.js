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
} from './user.controller.js';
import { createUserSchema, updateUserSchema } from './user.schema.js';

const router = Router();

// All user routes require a valid JWT
router.use(authMiddleware);

// checkPermission maps HTTP method → read / write / delete
// GET → read, POST → write, PUT → write, PATCH → write, DELETE → delete
// We reuse the 'customers' module permission key since users are the unified entity
router.use(checkPermission('customers'));

// ── Stats — must come BEFORE /:id to avoid "stats" being treated as a Mongo ObjectId ──
router.get('/stats', getStats);

// ── Collection ────────────────────────────────────────────────────────────────
router.get('/',  listUsers);
router.post('/', validate(createUserSchema), createUser);

// ── Single document ───────────────────────────────────────────────────────────
router.get('/:id',          getUser);
router.put('/:id',          validate(updateUserSchema), updateUser);
router.patch('/:id/status', toggleStatus);
router.delete('/:id',       deleteUser);

export default router;