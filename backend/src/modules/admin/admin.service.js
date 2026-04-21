import AdminRepository from './admin.repository.js';
import storageService from '../../services/storage.service.js';
import subAdminService from '../sub-admin/sub-admin.service.js';
// At top of admin.service.js, add these imports:
import crypto from 'crypto';
import mailQueue from '../../queues/mail.queue.js';
import { passwordResetTemplate } from '../../templates/email/passwordReset.template.js';


const AdminService = {
  getProfile: async (adminId) => {
    const admin = await AdminRepository.findById(adminId);
    if (!admin) throw { status: 401, message: 'Unauthorized' };
    return admin;
  },

  updateProfile: async (adminId, payload, file) => {
    let avatar;
    if (file) {
      const uploaded = await storageService.upload(file, 'avatars');
      if (uploaded) {
        const { avatar: oldAvatar } = await AdminRepository.findById(adminId);
        if (oldAvatar) {
          const key = oldAvatar.startsWith("/") ? oldAvatar.slice(1) : oldAvatar;
          await storageService.delete(key);
        }

        avatar = uploaded?.url;
      }

    }
    const admin = await AdminRepository.update(
      adminId,
      { ...payload, ...(avatar && { avatar }) },
      { new: true }
    );
    if (!admin) throw { status: 401, message: 'Unauthorized' };
    return admin;
  },
  /**
     * Login
     * Returns: { token, role, permissions }
     *   - permissions is a flat map for sub-admins: { module: { read, write, delete } }
     *   - permissions is null for full admin (frontend treats null as "all allowed")
     */
  login: async ({ email, password }) => {
    const admin = await AdminRepository.findByEmailWithPassword(email);
    if (!admin) throw { status: 401, message: 'Invalid email or password' };

    if (!admin.isActive) {
      throw { status: 403, message: 'Your account has been deactivated. Contact the administrator.' };
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) throw { status: 401, message: 'Invalid email or password' };

    const token = admin.generateToken();

    // Build permissions map for sub-admins
    let permissions = null;
    if (admin.role === 'sub-admin') {
      permissions = await subAdminService.getPermissionsMap(admin._id);
    }

    return {
      token,
      role: admin.role,
      permissions,
      admin: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        avatar: admin.avatar,
        role: admin.role,
      },
    };
  },

  updatePassword: async (adminId, oldPassword, newPassword) => {
    const admin = await AdminRepository.findByIdWithPassword(adminId);
    if (!admin) throw { status: 401, message: 'Unauthorized' };

    const isValid = await admin.comparePassword(oldPassword);
    if (!isValid) throw { status: 400, message: 'Current password is incorrect' };

    if (oldPassword === newPassword) {
      throw { status: 400, message: 'New password must be different from the current password' };
    }

    admin.password = newPassword;
    await admin.save();
    return admin;
  },

 // forgotPassword
forgotPassword: async (email) => {
  const admin = await AdminRepository.findByEmail(email);
  if (!admin) return; // silent — no email enumeration

  const rawToken = admin.generateResetToken();
  await admin.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
  const { subject, html } = passwordResetTemplate(admin.firstName, resetLink);

  await mailQueue.add('password-reset', { to: admin.email, subject, html }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  });
},

// resetPassword
resetPassword: async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const adminDoc = await AdminRepository.findByResetToken(hashedToken);

  if (!adminDoc) {
    throw { status: 400, message: 'Reset link is invalid or has expired' };
  }

  adminDoc.password = newPassword;
  adminDoc.resetToken = undefined;
  adminDoc.resetTokenExpiry = undefined;
  await adminDoc.save();
},
};
export default AdminService;