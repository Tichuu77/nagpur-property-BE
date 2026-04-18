import brokerService from '../broker.service.js';
import { successResponse } from '../../../utils/api-response.js';

export const createBroker = async (req, res, next) => {
  try {
    const broker = await brokerService.createBroker(req.body);
    res.status(201).json(successResponse(broker, 'Broker created successfully'));
  } catch (err) {
    next(err);
  }
};

export const listBrokers = async (req, res, next) => {
  try {
    const { search, isActive, page = 1, limit = 10 } = req.query;

    const result = await brokerService.listBrokers({
      search,
      isActive,
      page:  Number(page),
      limit: Number(limit),
    });

    res.status(200).json(
      successResponse(result.data, 'Brokers fetched successfully', {
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

export const getStats = async (req, res, next) => {
  try {
    const stats = await brokerService.getStats();
    res.status(200).json(successResponse(stats, 'Stats fetched successfully'));
  } catch (err) {
    next(err);
  }
};

export const getBroker = async (req, res, next) => {
  try {
    const broker = await brokerService.getBroker(req.params.id);
    res.status(200).json(successResponse(broker));
  } catch (err) {
    next(err);
  }
};

export const updateBroker = async (req, res, next) => {
  try {
    const broker = await brokerService.updateBroker(req.params.id, req.body);
    res.status(200).json(successResponse(broker, 'Broker updated successfully'));
  } catch (err) {
    next(err);
  }
};

export const deleteBroker = async (req, res, next) => {
  try {
    await brokerService.deleteBroker(req.params.id);
    res.status(200).json(successResponse(null, 'Broker deleted successfully'));
  } catch (err) {
    next(err);
  }
};

export const toggleStatus = async (req, res, next) => {
  try {
    const broker = await brokerService.toggleStatus(req.params.id);
    const label  = broker.isActive ? 'activated' : 'deactivated';
    res.status(200).json(successResponse(broker, `Broker ${label} successfully`));
  } catch (err) {
    next(err);
  }
};