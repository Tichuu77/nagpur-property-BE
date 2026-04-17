import { Router } from 'express';
import { updatePage, seedPages } from '../v1/static-pages.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import roleMiddleware from '../../../middlewares/role.middleware.js';

const router = Router();

// Admin only
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.put('/:slug', updatePage);
router.post('/seed', seedPages);

export default router;