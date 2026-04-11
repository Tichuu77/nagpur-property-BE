import { Router } from 'express';
import { getProfile, updateProfile, updateFcmToken } from './customer.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import upload from '../../../config/storage.config.js';


const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', upload.single('avatar'), updateProfile);
router.patch('/fcm-token', updateFcmToken);

export default router;