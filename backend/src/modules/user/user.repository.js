import User from '../../models/user.model.js';
import PurchasePlan from '../../models/purchaseSubscription.model.js'

const userRepository = {
  /**
   * Create a new user
   */
  create: (payload) => User.create(payload),

  /**
   * Find user by mobile
   */
  findByMobile: (mobile) => User.findOne({ mobile }),

  /**
   * Find user by email
   */
  findByEmail: (email) => User.findOne({ email }),

  /**
   * Find user by ID
   */
  findById: (id) => User.findById(id).select('-fcmToken'),

  /**
   * Find all users with server-side filtering and pagination
   * @param {Object} options
   * @param {string}  options.search   - Search across name, mobile, email, area, city
   * @param {string}  options.isActive - "all" | "active" | "inactive"
   * @param {string}  options.plan     - "all" | "free" | "basic" | "premium" | "enterprise"
   * @param {number}  options.page     - 1-based page number
   * @param {number}  options.limit    - Items per page (max 100)
   * @returns {{ data, total, page, limit, totalPages }}
   */
  findAll: async ({ search, isActive, plan, page = 1, limit = 10 } = {}) => {
    const filter = {};

    if (search?.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { mobile: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { area: { $regex: search.trim(), $options: 'i' } },
        { city: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (isActive && isActive !== 'all') {
      filter.isActive = isActive === 'active';
    }

    if (plan && plan !== 'all') {
      filter.plan = plan;
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      User.find(filter)
        .select('-fcmToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      User.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    };
  },

  /**
   * Get aggregate stats for overview cards
   * Returns: { total, active, inactive, free, paid }
   */
  getStats: async () => {
    const result = await User.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $facet: {
          total: [
            { $count: 'count' }
          ],
          active: [
            { $match: { isActive: true } },
            { $count: 'count' }
          ],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0] },
          active: { $ifNull: [{ $arrayElemAt: ['$active.count', 0] }, 0] },
        },
      },
      {
        $addFields: {
          inactive: { $subtract: ['$total', '$active'] },
        },
      },
    ]);

    return result[0] || { total: 0, active: 0, inactive: 0 };
  },
  /**
   * Update a user by ID
   */
  updateById: (id, update) =>
    User.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).select('-fcmToken'),

  /**
   * Delete a user by ID
   */
  deleteById: (id) => User.findByIdAndDelete(id),

  /**
   * Check if user exists by filter
   */
  exists: (filter) => User.exists(filter),
};

export default userRepository;