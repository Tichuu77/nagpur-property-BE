import revenueService from '../revenue.service.js';
import { successResponse } from '../../../utils/api-response.js';

/**
 * GET /api/v1/admin/revenue/stats
 * KPI cards: totalRevenue, monthlyRevenue, activeSubscriptions, expiringSoon
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await revenueService.getStats();
    res.status(200).json(successResponse(stats, 'Stats fetched successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/revenue/monthly
 * Last 6 months revenue + subscription count for the AreaChart
 */
export const getMonthlyRevenue = async (req, res, next) => {
  try {
    const data = await revenueService.getMonthlyRevenue();
    res.status(200).json(successResponse(data, 'Monthly revenue fetched successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/revenue/by-plan
 * Last 6 months subscriptions per plan for the stacked BarChart
 */
export const getSubscriptionsByPlan = async (req, res, next) => {
  try {
    const data = await revenueService.getSubscriptionsByPlan();
    res.status(200).json(successResponse(data, 'Subscriptions by plan fetched successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/revenue/plan-breakdown
 * Per-plan subscriber + revenue cards
 */
export const getPlanBreakdown = async (req, res, next) => {
  try {
    const data = await revenueService.getPlanBreakdown();
    res.status(200).json(successResponse(data, 'Plan breakdown fetched successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/revenue/transactions?search=&status=&page=1&limit=10
 * Paginated transaction list
 */
export const getTransactions = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const result = await revenueService.getTransactions({
      search,
      status,
      page:  Number(page),
      limit: Number(limit),
    });
    res.status(200).json(
      successResponse(result.data, 'Transactions fetched successfully', {
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