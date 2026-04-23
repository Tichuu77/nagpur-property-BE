import Property from '../../models/property.model.js';

const propertyRepository = {
  /**
   * Create a new property
   */
  create: (payload) => Property.create(payload),

  /**
   * Find all properties with server-side filtering, search, and pagination.
   * @param {Object} options
   * @param {string}  options.search        - Full-text search
   * @param {string}  options.status        - Filter by status
   * @param {string}  options.listingCategory
   * @param {string}  options.propertyType
   * @param {string}  options.locality
   * @param {string}  options.brokerId      - Filter by broker
   * @param {boolean} options.featured
   * @param {string}  options.dateFrom      - ISO date string
   * @param {string}  options.dateTo        - ISO date string
   * @param {number}  options.page
   * @param {number}  options.limit
   * @returns {{ data, total, page, limit, totalPages }}
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
   * Find property by ID, populated with broker info
   */
  findById: (id) =>
    Property.findById(id)
      .populate('brokerId', 'name mobile email city area avatar'),

  /**
   * Find by ID without populate (raw, for mutations)
   */
  findByIdRaw: (id) => Property.findById(id),

  /**
   * Update property
   */
  updateById: (id, update, options = { new: true }) =>
    Property.findByIdAndUpdate(id, update, { ...options, runValidators: true })
      .populate('brokerId', 'name mobile email city area avatar'),

  /**
   * Delete property
   */
  deleteById: (id) => Property.findByIdAndDelete(id),

  /**
   * Aggregate admin-facing stats
   */
  getStats: async () => {
    const [total, active, pending, rejected, featured, sold, rented] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'Active' }),
      Property.countDocuments({ status: 'Pending' }),
      Property.countDocuments({ status: 'Rejected' }),
      Property.countDocuments({ featured: true }),
      Property.countDocuments({ status: 'Sold' }),
      Property.countDocuments({ status: 'Rented' }),
    ]);

    // Category distribution
    const categoryBreakdown = await Property.aggregate([
      { $group: { _id: '$listingCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Type distribution
    const typeBreakdown = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Locality distribution
    const localityBreakdown = await Property.aggregate([
      { $group: { _id: '$location.locality', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return {
      total,
      active,
      pending,
      rejected,
      featured,
      sold,
      rented,
      categoryBreakdown,
      typeBreakdown,
      localityBreakdown,
    };
  },

  /**
   * Increment view count atomically
   */
  incrementViews: (id) =>
    Property.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }),

  /**
   * Increment inquiry count atomically
   */
  incrementInquiries: (id) =>
    Property.findByIdAndUpdate(id, { $inc: { inquiries: 1 } }, { new: true }),

  /**
   * Count properties by broker
   */
  countByBroker: (brokerId) => Property.countDocuments({ brokerId }),
};

export default propertyRepository;