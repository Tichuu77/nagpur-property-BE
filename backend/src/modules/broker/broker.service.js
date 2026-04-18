import brokerRepository from './broker.repository.js';

const brokerService = {
  createBroker: async (payload) => {
    // Uniqueness checks
    if (payload.mobile) {
      const existing = await brokerRepository.findByMobile(payload.mobile);
      if (existing) throw { status: 409, message: 'Mobile number already registered' };
    }
    if (payload.email && payload.email.trim()) {
      const existing = await brokerRepository.findByEmail(payload.email.trim());
      if (existing) throw { status: 409, message: 'Email already registered' };
    }
    return brokerRepository.create(payload);
  },

  listBrokers: async ({ search, isActive, page, limit } = {}) => {
    return brokerRepository.findAll({ search, isActive, page, limit });
  },

  getBroker: async (id) => {
    const broker = await brokerRepository.findById(id);
    if (!broker) throw { status: 404, message: 'Broker not found' };
    return broker;
  },

  updateBroker: async (id, payload) => {
    const broker = await brokerRepository.findById(id);
    if (!broker) throw { status: 404, message: 'Broker not found' };

    // Check uniqueness only if value changed
    if (payload.mobile && payload.mobile !== broker.mobile) {
      const existing = await brokerRepository.findByMobile(payload.mobile);
      if (existing) throw { status: 409, message: 'Mobile number already in use' };
    }
    if (payload.email && payload.email.trim() && payload.email.trim() !== broker.email) {
      const existing = await brokerRepository.findByEmail(payload.email.trim());
      if (existing) throw { status: 409, message: 'Email already in use' };
    }

    return brokerRepository.updateById(id, payload);
  },

  deleteBroker: async (id) => {
    const broker = await brokerRepository.findById(id);
    if (!broker) throw { status: 404, message: 'Broker not found' };
    return brokerRepository.deleteById(id);
  },

  getStats: () => brokerRepository.getStats(),

  toggleStatus: async (id) => {
    const broker = await brokerRepository.findById(id);
    if (!broker) throw { status: 404, message: 'Broker not found' };
    return brokerRepository.updateById(id, { isActive: !broker.isActive });
  },
};

export default brokerService;