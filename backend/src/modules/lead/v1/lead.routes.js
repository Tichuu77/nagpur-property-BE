import { Router } from 'express';
import authMiddleware       from '../../../middlewares/auth.middleware.js';
import checkPermission      from '../../../middlewares/check-permission.middleware.js';
import validate             from '../../../middlewares/validate.middleware.js';
import {
  createLead,
  listLeads,
  getStats,
  getLead,
  updateLead,
  updateStatus,
  deleteLead,
} from './lead.controller.js';
import {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
} from './lead.schema.js';

const router = Router();

// All lead routes require a valid JWT
router.use(authMiddleware);

// checkPermission maps HTTP method → read / write / delete
router.use(checkPermission('leads'));

// ── Stats (must come BEFORE /:id to avoid ObjectId conflict) ──────────────────
router.get('/stats', getStats);

// ── Collection ────────────────────────────────────────────────────────────────
router.get('/',  listLeads);
router.post('/', validate(createLeadSchema), createLead);

// ── Single document ───────────────────────────────────────────────────────────
router.get('/:id',          getLead);
router.put('/:id',          validate(updateLeadSchema), updateLead);
router.patch('/:id/status', validate(updateLeadStatusSchema), updateStatus);
router.delete('/:id',       deleteLead);

export default router;