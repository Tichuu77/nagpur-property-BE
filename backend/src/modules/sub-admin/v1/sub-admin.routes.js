import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import roleMiddleware from '../../../middlewares/role.middleware.js';
import validate from '../../../middlewares/validate.middleware.js';
import {
  createSubAdmin,
  listSubAdmins,
  getSubAdmin,
  getStats,
  updatePermissions,
  toggleStatus,
  deleteSubAdmin,
} from './sub-admin.controller.js';
import {
  createSubAdminSchema,
  updatePermissionsSchema,
} from './sub-admin.schema.js';

const router = Router();

// All sub-admin management requires a valid JWT
router.use(authMiddleware);

// Only full admins can manage sub-admins (sub-admins cannot manage each other)
router.use(roleMiddleware(['admin']));

// ── Stats (must be declared before /:id to avoid route conflict) ───────────────
router.get('/stats', getStats);

// ── Collection routes ──────────────────────────────────────────────────────────
router.get('/',  listSubAdmins);
router.post('/', validate(createSubAdminSchema), createSubAdmin);

// ── Document routes ────────────────────────────────────────────────────────────
router.get('/:id',                    getSubAdmin);
router.put('/:id/permissions',        validate(updatePermissionsSchema), updatePermissions);
router.patch('/:id/status',           toggleStatus);
router.delete('/:id',                 deleteSubAdmin);

export default router;