import analyticsService from '../analytics.service.js';
import { successResponse } from '../../../utils/api-response.js';

/**
 * GET /api/v1/admin/analytics/overview
 * Returns: pageViews, inquiries, conversionRate, activeUsers (last 7 days)
 */
export const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverview();
    res.status(200).json(successResponse(data, 'Overview fetched'));
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/admin/analytics/user-activity?period=week|month|year
 */
export const getUserActivity = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query;
    const data = await analyticsService.getUserActivity(period);
    res.status(200).json(successResponse(data, 'User activity fetched'));
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/admin/analytics/traffic-sources
 */
export const getTrafficSources = async (req, res, next) => {
  try {
    const data = await analyticsService.getTrafficSources();
    res.status(200).json(successResponse(data, 'Traffic sources fetched'));
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/admin/analytics/monthly-growth
 */
export const getMonthlyGrowth = async (req, res, next) => {
  try {
    const data = await analyticsService.getMonthlyGrowth();
    res.status(200).json(successResponse(data, 'Monthly growth fetched'));
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/admin/analytics/top-brokers?limit=5
 */
export const getTopBrokers = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const data = await analyticsService.getTopBrokers(Number(limit));
    res.status(200).json(successResponse(data, 'Top brokers fetched'));
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/admin/analytics/properties-by-location
 */
export const getPropertiesByLocation = async (req, res, next) => {
  try {
    const data = await analyticsService.getPropertiesByLocation();
    res.status(200).json(successResponse(data, 'Properties by location fetched'));
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/admin/analytics/property-type-distribution
 */
export const getPropertyTypeDistribution = async (req, res, next) => {
  try {
    const data = await analyticsService.getPropertyTypeDistribution();
    res.status(200).json(successResponse(data, 'Property type distribution fetched'));
  } catch (err) { next(err); }
};