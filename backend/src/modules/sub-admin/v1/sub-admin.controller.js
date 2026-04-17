import subAdminService from '../sub-admin.service.js';
import { successResponse } from '../../../utils/api-response.js';

/**
 * POST /v1/admin/sub-admins
 * Body: { firstName, lastName, email, phone, password, permissions[] }
 */
export const createSubAdmin = async (req, res, next) => {
  try {
    const { permissions = [], ...adminData } = req.body;
    const subAdmin = await subAdminService.createSubAdmin(adminData, permissions);
    res.status(201).json(successResponse(subAdmin, 'Sub-admin created successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /v1/admin/sub-admins?search=&status=&page=1&limit=10
 * Returns paginated list with meta in the `pagination` field.
 */
export const listSubAdmins = async (req, res, next) => {
  try {
    const {
      search,
      status,
      page  = 1,
      limit = 10,
    } = req.query;

    const result = await subAdminService.listSubAdmins({
      search,
      status,
      page:  Number(page),
      limit: Number(limit),
    });

    res.status(200).json(
      successResponse(
        result.data,
        'Sub-admins fetched successfully',
        {
          total:      result.total,
          page:       result.page,
          limit:      result.limit,
          totalPages: result.totalPages,
        }
      )
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /v1/admin/sub-admins/stats
 * Returns: { total, active, inactive }
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await subAdminService.getStats();
    res.status(200).json(successResponse(stats, 'Stats fetched successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /v1/admin/sub-admins/:id
 */
export const getSubAdmin = async (req, res, next) => {
  try {
    const subAdmin = await subAdminService.getSubAdmin(req.params.id);
    res.status(200).json(successResponse(subAdmin));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /v1/admin/sub-admins/:id/permissions
 * Body: { permissions: [{ module, permissions: { read, write, delete } }] }
 */
export const updatePermissions = async (req, res, next) => {
  try {
    const updated = await subAdminService.updatePermissions(
      req.params.id,
      req.body.permissions
    );
    res.status(200).json(successResponse(updated, 'Permissions updated successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /v1/admin/sub-admins/:id/status
 * Toggles isActive
 */
export const toggleStatus = async (req, res, next) => {
  try {
    const subAdmin = await subAdminService.toggleStatus(req.params.id);
    const label = subAdmin.isActive ? 'activated' : 'deactivated';
    res.status(200).json(successResponse(subAdmin, `Sub-admin ${label} successfully`));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /v1/admin/sub-admins/:id
 */
export const deleteSubAdmin = async (req, res, next) => {
  try {
    await subAdminService.deleteSubAdmin(req.params.id);
    res.status(200).json(successResponse(null, 'Sub-admin deleted successfully'));
  } catch (err) {
    next(err);
  }
};