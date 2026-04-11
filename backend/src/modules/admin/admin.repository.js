import admin from '../../models/admin.model.js';

const adminRepository = {
  findByPhone: (phone) => admin.findOne({ phone }),

  findByEmail: (email) => admin.findOne({ email }),

  findByEmailWithOTPToken: (email) => admin.findOne({ email }).select('+otpToken +otpExpiry'),

  findByEmailWithPassword: (email) => admin.findOne({ email }).select('+password'),

  findById: (id) => admin.findById(id),

  findByIdWithPassword: (id) => admin.findById(id).select('+password'),

  update: (id, update) => admin.findByIdAndUpdate(id, update, { new: true }),
};

export default  adminRepository;