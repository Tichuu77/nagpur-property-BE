import userRepository from './user.repository.js';

const userService = {
  /**
   * Create a new user
   * Validates uniqueness of mobile and email before creating
   */
  createUser: async (payload) => {
    // Check mobile uniqueness
    if (payload.mobile) {
      const existing = await userRepository.findByMobile(payload.mobile);
      if (existing) throw { status: 409, message: 'Mobile number already registered' };
    }

    // Check email uniqueness (only if provided and non-empty)
    if (payload.email && payload.email.trim()) {
      const existing = await userRepository.findByEmail(payload.email.trim());
      if (existing) throw { status: 409, message: 'Email already registered' };
    }

    return userRepository.create(payload);
  },

  /**
   * Get paginated list of users with server-side filtering
   */
  listUsers: async ({ search, isActive, plan, page, limit } = {}) => {
    return userRepository.findAll({ search, isActive, plan, page, limit });
  },

  /**
   * Get a single user by ID
   */
  getUser: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  },

  /**
   * Update user fields
   * Validates uniqueness of mobile/email if they are being changed
   */
  updateUser: async (id, payload) => {
    const user = await userRepository.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };

    // Check mobile uniqueness only if it changed
    if (payload.mobile && payload.mobile !== user.mobile) {
      const existing = await userRepository.findByMobile(payload.mobile);
      if (existing) throw { status: 409, message: 'Mobile number already in use' };
    }

    // Check email uniqueness only if it changed
    if (payload.email && payload.email.trim() && payload.email.trim() !== user.email) {
      const existing = await userRepository.findByEmail(payload.email.trim());
      if (existing) throw { status: 409, message: 'Email already in use' };
    }

    return userRepository.updateById(id, payload);
  },

  /**
   * Delete a user permanently
   */
  deleteUser: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };
    return userRepository.deleteById(id);
  },

  /**
   * Get aggregate stats for the overview cards
   */
  getStats: () => userRepository.getStats(),

  /**
   * Toggle isActive status
   */
  toggleStatus: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };
    return userRepository.updateById(id, { isActive: !user.isActive });
  },
};

export default userService;