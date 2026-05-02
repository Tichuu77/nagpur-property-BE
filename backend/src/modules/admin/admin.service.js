import AdminRepository from './admin.repository.js';
import storageService from '../../services/storage.service.js';
import subAdminService from '../sub-admin/sub-admin.service.js';
import crypto from 'crypto';
import mailQueue from '../../queues/mail.queue.js';
import { passwordResetTemplate } from '../../templates/email/passwordReset.template.js';
import env from '../../config/env.js';

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
        const existingAdmin = await AdminRepository.findById(adminId);
        if (existingAdmin?.avatar) {
          await storageService.delete( existingAdmin.avatar );
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
   * Returns: { token, role, permissions, admin }
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

  /**
   * forgotPassword
   * Generates a reset token, stores its hash, queues a reset-link email.
   * Always resolves successfully (no email enumeration).
   */
  forgotPassword: async (email) => {
    const admin = await AdminRepository.findByEmail(email);

    console.log('Forgot password requested for email:', email, 'Admin found:', admin);
    // Return silently even if admin not found — prevents email enumeration
    if (!admin) return null;

    const rawToken = admin.generateResetToken();
    await admin.save();

    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;
    const { subject, html } = passwordResetTemplate(admin.firstName, resetLink);

    console.log('Queuing password reset email for email:', email, 'Reset link:', resetLink);

    const job = await mailQueue.add(
      'password-reset',
      { to: admin.email, subject, html },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      }
    );

    console.log('Queued password reset email for email:', email, 'Job ID:', job.id);

    return null;
  },

  /**
   * resetPassword
   * Verifies the raw token against the stored hash, updates the password.
   */
  resetPassword: async (token, newPassword, confirmPassword) => {
    if (!token) throw { status: 400, message: 'Reset token is required' };

    if (newPassword !== confirmPassword) {
      throw { status: 400, message: 'Passwords do not match' };
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const adminDoc = await AdminRepository.findByResetToken(hashedToken);

    if (!adminDoc) {
      throw { status: 400, message: 'Reset link is invalid or has expired' };
    }

    adminDoc.password = newPassword;
    adminDoc.resetToken = undefined;
    adminDoc.resetTokenExpiry = undefined;
    await adminDoc.save();

    return null;
  },
};

export default AdminService;