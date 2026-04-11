import { Router } from 'express';
import { getProfile, updateProfile, updatePassword} from './admin.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import upload from '../../../config/storage.config.js';
import validate from '../../../middlewares/validate.middleware.js';
import {
    adminUpdateSchema,
    adminUpdatePassword,
} from './admin.schema.js';
const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', upload.single('avatar'), validate(adminUpdateSchema), updateProfile);
router.patch('/password-update', validate(adminUpdatePassword), updatePassword);
export default router;