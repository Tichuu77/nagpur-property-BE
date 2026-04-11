import { Router } from 'express';
import authRoutes from '../../modules/auth/v1/auth.routes.js';
import adminRoutes from '../../modules/admin/v1/admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);

router.use('/admin', adminRoutes);

export default router;
