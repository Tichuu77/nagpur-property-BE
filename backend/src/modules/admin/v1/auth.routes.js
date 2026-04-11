import { Router } from 'express';
import {  forgotPassword, login, resetPassword } from './admin.controller.js';
import validate from '../../../middlewares/validate.middleware.js';
import {
    adminLoginSchema,
    adminForgotPasswordSchema,
    resetPasswordSchema
} from './admin.schema.js';
const router = Router();
 


router.post('/login', validate(adminLoginSchema), login);
router.post('/forgot-password', validate(adminForgotPasswordSchema), forgotPassword);
router.post('/reset-password',validate(resetPasswordSchema), resetPassword);

export default router;