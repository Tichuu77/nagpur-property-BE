import Admin from '../../models/admin.model.js';

const subAdminRepository = {
  /**
   * Create sub-admin
   */
  create: async (adminData) => {
    return Admin.create({
      ...adminData,
      role: 'sub-admin',
    });
  },

  /**
   * Find sub-admin by email
   */
  findByEmail: async (email) => {
    return Admin.findOne({ email });
  },

  /**
   * Find all sub-admins
   */
  findAll: async () => {
    return Admin.find({ role: 'sub-admin' }).select(
      '-password -otp -otpToken -otpExpiry'
    );
  },

  /**
   * Find sub-admin by ID
   */
  findById: async (subAdminId) => {
    return Admin.findOne({
      _id: subAdminId,
      role: 'sub-admin',
    }).select('-password -otp -otpToken -otpExpiry');
  },

  /**
   * Find sub-admin by ID (raw, with password if needed internally)
   */
  findByIdRaw: async (subAdminId) => {
    return Admin.findOne({
      _id: subAdminId,
      role: 'sub-admin',
    });
  },

  /**
   * Toggle active status
   */
  toggleStatus: async (subAdmin) => {
    subAdmin.isActive = !subAdmin.isActive;
    return subAdmin.save();
  },

  /**
   * Delete sub-admin
   */
  deleteById: async (subAdminId) => {
    return Admin.findByIdAndDelete(subAdminId);
  },
};

export default subAdminRepository;