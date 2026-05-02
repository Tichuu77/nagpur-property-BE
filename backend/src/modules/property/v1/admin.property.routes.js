import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import checkPermission from '../../../middlewares/check-permission.middleware.js';
import upload from '../../../config/storage.config.js';
import validate from '../../../middlewares/validate.middleware.js';
import { parsePropertyBody } from './parsePropertyBody.middleware.js';
import { validateProperty, validatePropertyUpdate } from './validateProperty.middleware.js';
import { updateStatusSchema } from './property.schema.js';
import {
  listProperties,
  getStats,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  updateStatus,
  toggleFeatured,
  removePhotos,
} from './property.controller.js';

const router = Router();

// All routes require valid JWT + properties permission
router.use(authMiddleware);
router.use(checkPermission('properties'));

// ── Stats (before /:id to avoid collision) ────────────────────────────────────
router.get('/stats', getStats);

// ── Collection routes ─────────────────────────────────────────────────────────
router.get('/', listProperties);

/**
 * POST /api/v1/admin/properties
 *
 * Middleware chain (order matters):
 *   1. upload        — multer parses multipart, populates req.body + req.files
 *   2. parsePropertyBody — normalises Shape A / Shape B → req.parsedBody
 *   3. validateProperty  — full Zod validation → req.validatedBody
 *   4. createProperty    — controller, reads req.validatedBody + req.files
 */
router.post(
  '/',
  upload.fields([
    { name: 'photos', maxCount: 15 },
    { name: 'video',  maxCount: 1  },
  ]),
  parsePropertyBody,
  validateProperty,
  createProperty
);

// ── Document routes ────────────────────────────────────────────────────────────
router.get('/:id', getProperty);

/**
 * PUT /api/v1/admin/properties/:id
 *
 * Same chain as POST but uses validatePropertyUpdate which allows
 * partial updates (no listingCategory+propertyType = skip full validation).
 */
router.put(
  '/:id',
  upload.fields([
    { name: 'photos', maxCount: 15 },
    { name: 'video',  maxCount: 1  },
  ]),
  parsePropertyBody,
  validatePropertyUpdate,
  updateProperty
);

router.delete('/:id', deleteProperty);

// ── Status management ──────────────────────────────────────────────────────────
/**
 * PATCH /api/v1/admin/properties/:id/status
 * Body: { status: 'Active'|'Rejected'|'Inactive'|'Sold', adminNotes?, rejectedReason? }
 *
 * validate() coerces + validates req.body in-place before the controller runs.
 */
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);

/**
 * PATCH /api/v1/admin/properties/:id/featured
 * Body: { featured: true|false }  — or omit body to toggle
 */
router.patch('/:id/featured', toggleFeatured);

/**
 * PATCH /api/v1/admin/properties/:id/remove-photos
 * Body: { photoUrls: ['https://...', ...] }
 */
router.patch('/:id/remove-photos', removePhotos);

export default router;