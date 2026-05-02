import propertyService from '../property.service.js';
import { successResponse } from '../../../utils/api-response.js';

/**
 * GET /api/v1/admin/properties
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
 *
 * req.validatedBody — set by validateProperty middleware (route level)
 * req.files         — set by multer (upload middleware)
 */
export const createProperty = async (req, res, next) => {
  try {
    const photoFiles = req.files?.photos || [];
    const videoFile  = req.files?.video?.[0] || null;

    if (photoFiles.length === 0) {
      return next({ status: 400, message: 'At least one property photo is required' });
    }

    const property = await propertyService.createProperty(req.validatedBody, photoFiles, videoFile);
    res.status(201).json(successResponse(property, 'Property created successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admin/properties/:id
 *
 * req.validatedBody — set by validatePropertyUpdate middleware (route level)
 * req.files         — set by multer (upload middleware)
 */
export const updateProperty = async (req, res, next) => {
  try {
    const photoFiles = req.files?.photos || [];
    const videoFile  = req.files?.video?.[0] || null;

    const property = await propertyService.updateProperty(
      req.params.id, req.validatedBody, photoFiles, videoFile
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
 *
 * req.body is already coerced + validated by validate(updateStatusSchema)
 * middleware at the route level — no re-parsing needed here.
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, rejectedReason } = req.body;
    const property = await propertyService.updateStatus(
      req.params.id, status, { adminNotes, rejectedReason }
    );
    res.status(200).json(successResponse(property, `Property ${status.toLowerCase()} successfully`));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/admin/properties/:id/featured
 * Body: { featured: true|false }  — or omit body to toggle
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
 * Body: { photoUrls: ['https://...', ...] }
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