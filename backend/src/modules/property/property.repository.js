import Property from '../../models/property.model.js';

const propertyRepository = {
  /**
   * Create a new property
   */
  create: (payload) => Property.create(payload).lean,

  /**
   * Find all properties with server-side filtering, search, and pagination.
   */
  findAll: async ({
    search,
    status,
    listingCategory,
    propertyType,
    locality,
    brokerId,
    featured,
    dateFrom,
    dateTo,
    page = 1,
    limit = 10,
  } = {}) => {
    const filter = {};

    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (listingCategory && listingCategory !== 'all') {
      filter.listingCategory = listingCategory;
    }
    if (propertyType && propertyType !== 'all') {
      filter.propertyType = propertyType;
    }
    if (locality && locality !== 'all') {
      filter['location.locality'] = locality;
    }
    if (brokerId) {
      filter.brokerId = brokerId;
    }
    if (featured === 'true' || featured === true) {
      filter.featured = true;
    }
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo)   filter.createdAt.$lte = new Date(dateTo);
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const safePage  = Math.max(Number(page) || 1, 1);
    const skip      = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      Property.find(filter)
        .populate('brokerId', 'name mobile email city area avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Property.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page:       safePage,
      limit:      safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    };
  },

  /**
   * Find property by ID, populated with broker info.
   * FIX: use .lean() so service gets a plain object (safe to spread/mutate for media formatting)
   */
  findById: (id) =>
    Property.findById(id)
      .populate('brokerId', 'name mobile email city area avatar')
      .lean(),

  /**
   * Find by ID without populate (raw mongoose doc, for mutations)
   */
  findByIdRaw: (id) => Property.findById(id),

  /**
   * Update property — returns populated plain object via lean
   */
  updateById: (id, update, options = { new: true }) =>
    Property.findByIdAndUpdate(id, update, { ...options, runValidators: true })
      .populate('brokerId', 'name mobile email city area avatar')
      .lean(),

  /**
   * Delete property
   */
  deleteById: (id) => Property.findByIdAndDelete(id),

  /**
   * Aggregate admin-facing stats.
   * FIX: only query statuses that exist in PROPERTY_STATUSES constant.
   *      Removed 'Draft' (not in schema). 'Pending' and 'Rented' added to constants.
   */
  getStats: async () => {
    const [total, active, pending, rejected, featured, sold, rented, inactive] =
      await Promise.all([
        Property.countDocuments(),
        Property.countDocuments({ status: 'Active' }),
        Property.countDocuments({ status: 'Pending' }),
        Property.countDocuments({ status: 'Rejected' }),
        Property.countDocuments({ featured: true }),
        Property.countDocuments({ status: 'Sold' }),
        Property.countDocuments({ status: 'Rented' }),
        Property.countDocuments({ status: 'Inactive' }),
      ]);

    const [categoryBreakdown, typeBreakdown, localityBreakdown] = await Promise.all([
      Property.aggregate([
        { $group: { _id: '$listingCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Property.aggregate([
        { $group: { _id: '$propertyType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Property.aggregate([
        { $group: { _id: '$location.locality', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return {
      total,
      active,
      pending,
      rejected,
      featured,
      sold,
      rented,
      inactive,
      categoryBreakdown,
      typeBreakdown,
      localityBreakdown,
    };
  },

  incrementViews: (id) =>
    Property.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }),

  incrementInquiries: (id) =>
    Property.findByIdAndUpdate(id, { $inc: { inquiries: 1 } }, { new: true }),

  countByBroker: (brokerId) => Property.countDocuments({ brokerId }),
};

export default propertyRepository;