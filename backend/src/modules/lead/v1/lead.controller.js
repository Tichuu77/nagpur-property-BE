import leadService from '../lead.service.js';
import { successResponse } from '../../../utils/api-response.js';


/**
 * GET /api/v1/admin/leads?search=&status=&area=&propertyType=&dateFrom=&dateTo=&page=1&limit=10
 */
export const listLeads = async (req, res, next) => {
  try {
    const {
      search,
      status,
      area,
      propertyType,
      dateFrom,
      dateTo,
      page  = 1,
      limit = 10,
    } = req.query;

    const result = await leadService.listLeads({
      search,
      status,
      area,
      propertyType,
      dateFrom,
      dateTo,
      page:  Number(page),
      limit: Number(limit),
    });

    res.status(200).json(
      successResponse(
        result.data,
        'Leads fetched successfully',
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
 * GET /api/v1/admin/leads/stats
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await leadService.getStats();
    res.status(200).json(successResponse(stats, 'Stats fetched successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/leads/:id
 */
export const getLead = async (req, res, next) => {
  try {
    const lead = await leadService.getLead(req.params.id);
    res.status(200).json(successResponse(lead));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/admin/leads/:id
 */
export const updateLead = async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    res.status(200).json(successResponse(lead, 'Lead updated successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/admin/leads/:id/status
 * Body: { status: 'New' | 'Contacted' | 'Closed' }
 */
export const updateStatus = async (req, res, next) => {
  try {
    const lead = await leadService.updateStatus(req.params.id, req.body.status);
    const label = lead.status.toLowerCase();
    res.status(200).json(successResponse(lead, `Lead marked as ${label}`));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/admin/leads/:id
 */
export const deleteLead = async (req, res, next) => {
  try {
    await leadService.deleteLead(req.params.id);
    res.status(200).json(successResponse(null, 'Lead deleted successfully'));
  } catch (err) {
    next(err);
  }
};