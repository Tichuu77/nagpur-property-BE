import AdminRepository from './admin.repository.js';
import storageService from '../../services/storage.service.js';

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
      avatar = uploaded?.url;
    }
    const admin = await AdminRepository.update(
      adminId,
      { ...payload, ...(avatar && { avatar }) },
      { new: true }
    );
    if (!admin) throw { status: 401, message: 'Unauthorized' };
    return  admin;
  },

  login: async (payload) => {
    const email = payload?.email;
    const password = payload?.password;
    const admin = await AdminRepository.findByEmailWithPassword(email);
    if (!admin) throw { status: 401, message: 'Unauthorized' };
    const isValid = await admin.comparePassword(password);
    if (!isValid) throw { status: 401, message: 'Unauthorized' };
    const token = await admin.generateToken();
    return token;
  },

  updatePassword: async (adminId, oldPassword, newPassword) => {
    const admin = await AdminRepository.findByIdWithPassword(adminId);
    if (!admin) throw { status: 401, message: 'Unauthorized' };
    const isValid = await admin.comparePassword(oldPassword);
    if (!isValid) throw { status: 401, message: 'Unauthorized' };
    if (oldPassword === newPassword) throw { status: 400, message: 'New password must be different from old password' };
    admin.password = newPassword;
    await admin.save();
    return admin;
  },

  forgotPassword: async (email) => {
    const admin = await AdminRepository.findByEmailWithOTPToken(email);
    if (!admin) throw { status: 401, message: 'Unauthorized' };
    const otp = await admin.generateOTP();
    await admin.save();
    return otp;
  },

  resetPassword: async ( email, otp, newPassword) => {
    const admin = await AdminRepository.findByEmailWithOTPToken(email);
    if (!admin) throw { status: 404, message: 'Admin not found' };
    if (!admin.verifyOTP(otp)) throw { status: 404, message: 'Invalid OTP' };
    admin.password = newPassword;
    await admin.save();
    return admin;
  },

};

export default AdminService;