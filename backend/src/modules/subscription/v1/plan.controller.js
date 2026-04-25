import planService from '../plan.service.js';
import { successResponse } from '../../../utils/api-response.js';

export const listPlans = async (req, res, next) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;
    const result = await planService.listPlans({ isActive, page: Number(page), limit: Number(limit) });
    res.status(200).json(successResponse(result.data, 'Plans fetched successfully', {
      total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages,
    }));
  } catch (err) { next(err); }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await planService.getStats();
    res.status(200).json(successResponse(stats, 'Stats fetched'));
  } catch (err) { next(err); }
};

export const getPlan = async (req, res, next) => {
  try {
    const plan = await planService.getPlan(req.params.id);
    res.status(200).json(successResponse(plan));
  } catch (err) { next(err); }
};

export const createPlan = async (req, res, next) => {
  try {
    const plan = await planService.createPlan(req.body);
    res.status(201).json(successResponse(plan, 'Plan created successfully'));
  } catch (err) { next(err); }
};

export const updatePlan = async (req, res, next) => {
  try {
    const plan = await planService.updatePlan(req.params.id, req.body);
    res.status(200).json(successResponse(plan, 'Plan updated successfully'));
  } catch (err) { next(err); }
};

export const toggleStatus = async (req, res, next) => {
  try {
    const plan = await planService.toggleStatus(req.params.id);
    res.status(200).json(successResponse(plan, `Plan ${plan.isActive ? 'activated' : 'deactivated'}`));
  } catch (err) { next(err); }
};

export const deletePlan = async (req, res, next) => {
  try {
    await planService.deletePlan(req.params.id);
    res.status(200).json(successResponse(null, 'Plan deleted successfully'));
  } catch (err) { next(err); }
};