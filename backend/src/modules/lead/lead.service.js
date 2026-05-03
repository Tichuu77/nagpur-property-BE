import leadRepository from './lead.repository.js';

const leadService = {

  /**
   * Get paginated list with server-side filtering
   */
  listLeads: async ({ search, status, area, propertyType, dateFrom, dateTo, page, limit } = {}) => {
    return leadRepository.findAll({ search, status, area, propertyType, dateFrom, dateTo, page, limit });
  },

  /**
   * Get a single lead by ID
   */
  getLead: async (id) => {
    const lead = await leadRepository.findById(id);
    if (!lead) throw { status: 404, message: 'Lead not found' };
    return lead;
  },

  /**
   * Update lead fields
   */
  updateLead: async (id, payload) => {
    const lead = await leadRepository.findById(id);
    if (!lead) throw { status: 404, message: 'Lead not found' };
    return leadRepository.updateById(id, payload);
  },

  /**
   * Delete a lead permanently
   */
  deleteLead: async (id) => {
    const lead = await leadRepository.findById(id);
    if (!lead) throw { status: 404, message: 'Lead not found' };
    return leadRepository.deleteById(id);
  },

  /**
   * Get aggregate stats for overview cards
   */
  getStats: () => leadRepository.getStats(),

  /**
   * Update lead status
   */
  updateStatus: async (id, status) => {
    const lead = await leadRepository.findById(id);
    if (!lead) throw { status: 404, message: 'Lead not found' };
    return leadRepository.updateById(id, { status });
  },
};

export default leadService;