import Broker from '../../models/user.model.js';

const brokerRepository = {
  create: (payload) => Broker.create(payload),

  findByMobile: (mobile) => Broker.findOne({ mobile }),

  findByEmail: (email) => Broker.findOne({ email }),

  findById: (id) => Broker.findById(id),

  findAll: async ({ search, isActive, page = 1, limit = 10 } = {}) => {
    const filter = {};

    if (search?.trim()) {
      filter.$or = [
        { name:   { $regex: search.trim(), $options: 'i' } },
        { mobile: { $regex: search.trim(), $options: 'i' } },
        { email:  { $regex: search.trim(), $options: 'i' } },
        { area:   { $regex: search.trim(), $options: 'i' } },
        { city:   { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // isActive query param: "active" | "inactive" | "all" (or omitted)
    if (isActive && isActive !== 'all') {
      filter.isActive = isActive === 'active';
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const safePage  = Math.max(Number(page) || 1, 1);
    const skip      = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      Broker.find(filter)
        .select('-fcmToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Broker.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page:       safePage,
      limit:      safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    };
  },

  updateById: (id, update) =>
    Broker.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }),

  deleteById: (id) => Broker.findByIdAndDelete(id),

  getStats: async () => {
    const [total, active] = await Promise.all([
      Broker.countDocuments(),
      Broker.countDocuments({ isActive: true }),
    ]);
    return { total, active, inactive: total - active };
  },
};

export default brokerRepository;