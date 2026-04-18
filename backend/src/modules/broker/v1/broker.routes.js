import { Router } from 'express';
import authMiddleware       from '../../../middlewares/auth.middleware.js';
import checkPermission      from '../../../middlewares/check-permission.middleware.js';
import validate             from '../../../middlewares/validate.middleware.js';
import {
  createBroker,
  listBrokers,
  getStats,
  getBroker,
  updateBroker,
  deleteBroker,
  toggleStatus,
} from './broker.controller.js';
import { createBrokerSchema, updateBrokerSchema } from './broker.schema.js';

const router = Router();

// All broker routes require a valid JWT
router.use(authMiddleware);

// checkPermission maps HTTP method → read/write/delete
// GET  → read, POST → write, PUT → write, PATCH → write, DELETE → delete
router.use(checkPermission('brokers'));

// ── Stats must come BEFORE /:id to avoid "stats" being treated as a Mongo ObjectId ──
router.get('/stats', getStats);

// ── Collection ────────────────────────────────────────────────────────────────
router.get('/',  listBrokers);
router.post('/', validate(createBrokerSchema), createBroker);

// ── Single document ───────────────────────────────────────────────────────────
router.get('/:id',          getBroker);
router.put('/:id',          validate(updateBrokerSchema), updateBroker);
router.patch('/:id/status', toggleStatus);
router.delete('/:id',       deleteBroker);

export default router;