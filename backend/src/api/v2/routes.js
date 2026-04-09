import { Router } from 'express';
import authRoutes from '../../modules/auth/v2/auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);

export default router;
