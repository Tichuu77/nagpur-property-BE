import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import checkPermission from '../../../middlewares/check-permission.middleware.js';
import upload from '../../../config/storage.config.js';
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
 * Accepts multipart/form-data:
 *   Field 'data'   → JSON string with all property fields
 *   Field 'photos' → up to 15 image files
 *   Field 'video'  → optional 1 video file
 *
 * OR flat form fields (details/pricing/location as JSON strings)
 */
router.post(
  '/',
  upload.fields([
    { name: 'photos', maxCount: 15 },
    { name: 'video',  maxCount: 1  },
  ]),
  createProperty
);

// ── Document routes ────────────────────────────────────────────────────────────
router.get('/:id', getProperty);

router.put(
  '/:id',
  upload.fields([
    { name: 'photos', maxCount: 15 },
    { name: 'video',  maxCount: 1  },
  ]),
  updateProperty
);

router.delete('/:id', deleteProperty);

// ── Status management ──────────────────────────────────────────────────────────
/**
 * PATCH /api/v1/admin/properties/:id/status
 * Body: { status: 'Active'|'Rejected'|'Inactive'|'Sold'|'Rented'|..., adminNotes?, rejectedReason? }
 *
 * Common usage:
 *   Approve → { status: 'Active' }
 *   Reject  → { status: 'Rejected', rejectedReason: '...' }
 *   Mark sold → { status: 'Sold' }
 */
router.patch('/:id/status', updateStatus);

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