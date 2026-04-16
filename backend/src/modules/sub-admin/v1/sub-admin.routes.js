import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import roleMiddleware from '../../../middlewares/role.middleware.js';
import validate from '../../../middlewares/validate.middleware.js';
import {
  createSubAdmin,
  listSubAdmins,
  getSubAdmin,
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

// All sub-admin management is ONLY for role === "admin"
// Sub-admins cannot manage other sub-admins
router.use(roleMiddleware(['admin']));

router.get('/',    listSubAdmins);
router.post('/',   validate(createSubAdminSchema),    createSubAdmin);
router.get('/:id', getSubAdmin);
router.put('/:id/permissions', validate(updatePermissionsSchema), updatePermissions);
router.patch('/:id/status',    toggleStatus);
router.delete('/:id',          deleteSubAdmin);

export default router;