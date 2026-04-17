import subAdminRepository from './sub-admin.repository.js';
import permissionRepository from './permission.repository.js';

const subAdminService = {
  /**
   * Create Sub-Admin
   */
  createSubAdmin: async (adminData, modulePermissions = []) => {
    const existing = await subAdminRepository.findByEmail(adminData.email);
    if (existing) {
      throw { status: 409, message: 'Email already in use' };
    }

    const subAdmin = await subAdminRepository.create(adminData);

    if (modulePermissions?.length > 0) {
      await permissionRepository.replaceAll(subAdmin._id, modulePermissions);
    }

    return subAdmin;
  },

  /**
   * List all sub-admins with permissions
   */
  listSubAdmins: async () => {
    const subAdmins = await subAdminRepository.findAll();

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
   * Get single sub-admin
   */
  getSubAdmin: async (subAdminId) => {
    const subAdmin = await subAdminRepository.findById(subAdminId);

    if (!subAdmin) {
      throw { status: 404, message: 'Sub-admin not found' };
    }

    const permissions = await permissionRepository.findAllByAdminId(subAdminId);

    return {
      ...subAdmin.toObject(),
      permissions,
    };
  },

  /**
   * Update permissions (replace all)
   */
  updatePermissions: async (subAdminId, modulePermissions = []) => {
    const subAdmin = await subAdminRepository.findByIdRaw(subAdminId);

    if (!subAdmin) {
      throw { status: 404, message: 'Sub-admin not found' };
    }

    await permissionRepository.replaceAll(subAdminId, modulePermissions);

    const updatedPermissions =
      await permissionRepository.findAllByAdminId(subAdminId);

    return updatedPermissions;
  },

  /**
   * Toggle active/inactive status
   */
  toggleStatus: async (subAdminId) => {
    const subAdmin = await subAdminRepository.findByIdRaw(subAdminId);

    if (!subAdmin) {
      throw { status: 404, message: 'Sub-admin not found' };
    }

    const updated = await subAdminRepository.toggleStatus(subAdmin);
    return updated;
  },

  /**
   * Delete sub-admin + permissions
   */
  deleteSubAdmin: async (subAdminId) => {
    const subAdmin = await subAdminRepository.findByIdRaw(subAdminId);

    if (!subAdmin) {
      throw { status: 404, message: 'Sub-admin not found' };
    }

    await permissionRepository.deleteAllByAdminId(subAdminId);
    await subAdminRepository.deleteById(subAdminId);

    return { message: 'Sub-admin deleted successfully' };
  },

  /**
   * Get permissions map (used in login)
   * Output: { module: { read, write, delete } }
   */
  getPermissionsMap: async (adminId) => {
    const records = await permissionRepository.findAllByAdminId(adminId);

    const map = {};

    for (const record of records) {
      map[record.module] = {
        read: record.permissions.read,
        write: record.permissions.write,
        delete: record.permissions.delete,
      };
    }

    return map;
  },
};

export default subAdminService;