import Admin from '../../models/admin.model.js';
import permissionRepository from './permission.repository.js';

/**
 * Sub-Admin Service
 *
 * Handles all sub-admin CRUD and permission assignment.
 * Only users with role === "admin" reach these methods (enforced at the route level).
 */
const subAdminService = {
  /**
   * Create a new sub-admin account with initial permissions.
   *
   * @param {{ firstName, lastName, email, phone, password }} adminData
   * @param {Array<{ module, permissions: { read, write, delete } }>} modulePermissions
   */
  createSubAdmin: async (adminData, modulePermissions = []) => {
    // Check email uniqueness
    const existing = await Admin.findOne({ email: adminData.email });
    if (existing) throw { status: 409, message: 'Email already in use' };

    const subAdmin = await Admin.create({
      ...adminData,
      role: 'sub-admin',
    });

    // Assign permissions if provided
    if (modulePermissions.length > 0) {
      await permissionRepository.replaceAll(subAdmin._id, modulePermissions);
    }

    return subAdmin;
  },

  /**
   * List all sub-admins with their aggregated permission records.
   */
  listSubAdmins: async () => {
    const subAdmins = await Admin.find({ role: 'sub-admin' }).select('-password -otp -otpToken -otpExpiry');

    // Attach permissions for each sub-admin
    const result = await Promise.all(
      subAdmins.map(async (sa) => {
        const permissions = await permissionRepository.findAllByAdminId(sa._id);
        return {
          ...sa.toObject(),
          permissions,
        };
      })
    );

    return result;
  },

  /**
   * Get a single sub-admin with their permissions.
   */
  getSubAdmin: async (subAdminId) => {
    const subAdmin = await Admin.findOne({ _id: subAdminId, role: 'sub-admin' }).select(
      '-password -otp -otpToken -otpExpiry'
    );
    if (!subAdmin) throw { status: 404, message: 'Sub-admin not found' };

    const permissions = await permissionRepository.findAllByAdminId(subAdminId);
    return { ...subAdmin.toObject(), permissions };
  },

  /**
   * Update (replace) all permissions for a sub-admin.
   *
   * @param {string} subAdminId
   * @param {Array<{ module, permissions: { read, write, delete } }>} modulePermissions
   */
  updatePermissions: async (subAdminId, modulePermissions) => {
    const subAdmin = await Admin.findOne({ _id: subAdminId, role: 'sub-admin' });
    if (!subAdmin) throw { status: 404, message: 'Sub-admin not found' };

    await permissionRepository.replaceAll(subAdminId, modulePermissions);

    const updated = await permissionRepository.findAllByAdminId(subAdminId);
    return updated;
  },

  /**
   * Toggle a sub-admin's isActive status.
   */
  toggleStatus: async (subAdminId) => {
    const subAdmin = await Admin.findOne({ _id: subAdminId, role: 'sub-admin' });
    if (!subAdmin) throw { status: 404, message: 'Sub-admin not found' };

    subAdmin.isActive = !subAdmin.isActive;
    await subAdmin.save();
    return subAdmin;
  },

  /**
   * Delete a sub-admin and all their permission records.
   */
  deleteSubAdmin: async (subAdminId) => {
    const subAdmin = await Admin.findOne({ _id: subAdminId, role: 'sub-admin' });
    if (!subAdmin) throw { status: 404, message: 'Sub-admin not found' };

    await permissionRepository.deleteAllByAdminId(subAdminId);
    await Admin.findByIdAndDelete(subAdminId);
  },

  /**
   * Fetch permissions for the currently logged-in sub-admin (used in login response).
   * Returns a flat object: { module: { read, write, delete } }
   */
  getPermissionsMap: async (adminId) => {
    const records = await permissionRepository.findAllByAdminId(adminId);
    const map = {};
    for (const record of records) {
      map[record.module] = {
        read:   record.permissions.read,
        write:  record.permissions.write,
        delete: record.permissions.delete,
      };
    }
    return map;
  },
};

export default subAdminService;