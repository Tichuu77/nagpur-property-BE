import { Router } from 'express';
import { getPage, listPages } from './static-pages.controller.js';

const router = Router();

// Public routes — no auth required
router.get('/',      listPages);
router.get('/:slug', getPage);

export default router;