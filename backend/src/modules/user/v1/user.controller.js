import userService from '../user.service.js';
import { successResponse } from '../../../utils/api-response.js';

/**
 * POST /api/v1/admin/users
 * Create a new user
 */
export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(successResponse(user, 'User created successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/users?search=&isActive=&plan=&page=1&limit=10
 * Paginated, server-filtered list of users
 */
export const listUsers = async (req, res, next) => {
  try {
    const { search, isActive, plan, page = 1, limit = 10 } = req.query;

    const result = await userService.listUsers({
      search,
      isActive,
      plan,
      page:  Number(page),
      limit: Number(limit),
    });

    res.status(200).json(
      successResponse(
        result.data,
        'Users fetched successfully',
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
 * GET /api/v1/admin/users/stats
 * Aggregate counts for overview cards
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await userService.getStats();
    res.status(200).json(successResponse(stats, 'Stats fetched successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/users/:id
 * Single user detail
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.status(200).json(successResponse(user));
  } catch (err) {
    next(err);
  }
};

export const getPropLeadPlanQueryStats = async (req, res, next) => {
  try {
    const stats = await userService.getPropLeadPlanQueryStats(req.params.id);
    res.status(200).json(successResponse(stats, 'Stats fetched successfully'));
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/admin/users/:id
 * Update user fields (partial update supported)
 */
export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(successResponse(user, 'User updated successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/admin/users/:id/status
 * Toggle isActive (active ↔ inactive)
 */
export const toggleStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleStatus(req.params.id);
    const label = user.isActive ? 'activated' : 'deactivated';
    res.status(200).json(successResponse(user, `User ${label} successfully`));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/admin/users/:id
 * Permanently delete a user
 */
export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json(successResponse(null, 'User deleted successfully'));
  } catch (err) {
    next(err);
  }
};