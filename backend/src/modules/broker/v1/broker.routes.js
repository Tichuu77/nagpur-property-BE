import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import checkPermission from '../../../middlewares/check-permission.middleware.js';
import validate from '../../../middlewares/validate.middleware.js';
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

router.use(authMiddleware);
router.use(checkPermission('brokers'));

// Stats — before /:id to avoid route conflict
router.get('/stats', getStats);

// Collection
router.get('/',  listBrokers);
router.post('/', validate(createBrokerSchema), createBroker);

// Document
router.get('/:id',           getBroker);
router.put('/:id',           validate(updateBrokerSchema), updateBroker);
router.patch('/:id/status',  toggleStatus);
router.delete('/:id',        deleteBroker);

export default router;