import propertyService from '../property.service.js';
import { successResponse } from '../../../utils/api-response.js';
import { validatePropertyPayload, updateStatusSchema } from './property.schema.js';

/**
 * GET /api/v1/admin/properties
 * Query params: search, status, listingCategory, propertyType, locality,
 *               brokerId, featured, dateFrom, dateTo, page, limit
 */
export const listProperties = async (req, res, next) => {
  try {
    const {
      search, status, listingCategory, propertyType, locality,
      brokerId, featured, dateFrom, dateTo,
      page = 1, limit = 10,
    } = req.query;

    const result = await propertyService.listProperties({
      search, status, listingCategory, propertyType,
      locality, brokerId, featured, dateFrom, dateTo,
      page: Number(page), limit: Number(limit),
    });

    res.status(200).json(
      successResponse(result.data, 'Properties fetched successfully', {
        total:      result.total,
        page:       result.page,
        limit:      result.limit,
        totalPages: result.totalPages,
      })
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/properties/stats
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await propertyService.getStats();
    res.status(200).json(successResponse(stats, 'Stats fetched successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/properties/:id
 */
export const getProperty = async (req, res, next) => {
  try {
    const property = await propertyService.getProperty(req.params.id);
    res.status(200).json(successResponse(property));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/admin/properties
 * Body: multipart/form-data
 *   - JSON fields in field 'data' (stringified) OR as flat form fields
 *   - photos: up to 15 image files (field name 'photos')
 *   - video: optional video file  (field name 'video')
 */
export const createProperty = async (req, res, next) => {
  try {
    // Parse body — supports both JSON string in 'data' field and flat body
    let body;
    if (req.body?.data) {
      try { body = JSON.parse(req.body.data); }
      catch { return next({ status: 400, message: 'Invalid JSON in data field' }); }
    } else {
      body = req.body;
      // Nested objects may arrive as strings from multipart
      ['details', 'pricing', 'location', 'amenities'].forEach((key) => {
        if (typeof body[key] === 'string') {
          try { body[key] = JSON.parse(body[key]); } catch {
            return next({ status: 400, message: `Invalid JSON in ${key} field` });
          }
        }
      });
    }

    const { error, data } = validatePropertyPayload(body);
    if (error) return next({ status: 400, message: error });

    const photoFiles = req.files?.photos || [];
    const videoFile  = req.files?.video?.[0] || null;

    if (photoFiles.length === 0) {
      return next({ status: 400, message: 'At least one property photo is required' });
    }

    const property = await propertyService.createProperty(data, photoFiles, videoFile);
    res.status(201).json(successResponse(property, 'Property created successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admin/properties/:id
 * Same multipart structure as POST. Only provided fields are updated.
 */
export const updateProperty = async (req, res, next) => {
  try {
    let body;
    if (req.body?.data) {
      try { body = JSON.parse(req.body.data); }
      catch { return next({ status: 400, message: 'Invalid JSON in data field' }); }
    } else {
      body = req.body;
      ['details', 'pricing', 'location', 'amenities'].forEach((key) => {
        if (typeof body[key] === 'string') {
          try { body[key] = JSON.parse(body[key]); } catch {
            return next({ status: 400, message: `Invalid JSON in ${key} field` });
          }
        }
      });
    }

    // For updates, validate only if category+type provided
    // Otherwise do a partial update with basic schema check
    if (body.listingCategory && body.propertyType) {
      const { error, data } = validatePropertyPayload(body);
      if (error) return next({ status: 400, message: error });
      body = data;
    }

    const photoFiles = req.files?.photos || [];
    const videoFile  = req.files?.video?.[0] || null;

    const property = await propertyService.updateProperty(
      req.params.id, body, photoFiles, videoFile
    );
    res.status(200).json(successResponse(property, 'Property updated successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/admin/properties/:id
 */
export const deleteProperty = async (req, res, next) => {
  try {
    await propertyService.deleteProperty(req.params.id);
    res.status(200).json(successResponse(null, 'Property deleted successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/admin/properties/:id/status
 * Body: { status, adminNotes?, rejectedReason? }
 */
export const updateStatus = async (req, res, next) => {
  try {
    const result = updateStatusSchema.safeParse(req.body);
    if (!result.success) {
      return next({
        status: 400,
        message: result.error.issues.map((i) => i.message).join('; '),
      });
    }

    const { status, adminNotes, rejectedReason } = result.data;
    const property = await propertyService.updateStatus(
      req.params.id, status, { adminNotes, rejectedReason }
    );
    const label = status.toLowerCase();
    res.status(200).json(successResponse(property, `Property ${label} successfully`));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/admin/properties/:id/featured
 * Body: { featured: boolean } — explicit set
 *   OR  no body          — toggle
 */
export const toggleFeatured = async (req, res, next) => {
  try {
    let property;
    if (typeof req.body?.featured === 'boolean') {
      property = await propertyService.setFeatured(req.params.id, req.body.featured);
    } else {
      property = await propertyService.toggleFeatured(req.params.id);
    }
    const label = property.featured ? 'marked as featured' : 'removed from featured';
    res.status(200).json(successResponse(property, `Property ${label}`));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/admin/properties/:id/remove-photos
 * Body: { photoUrls: string[] }
 */
export const removePhotos = async (req, res, next) => {
  try {
    const { photoUrls } = req.body;
    if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
      return next({ status: 400, message: 'Provide an array of photoUrls to remove' });
    }
    const property = await propertyService.removePhotos(req.params.id, photoUrls);
    res.status(200).json(successResponse(property, 'Photos removed successfully'));
  } catch (err) {
    next(err);
  }
};