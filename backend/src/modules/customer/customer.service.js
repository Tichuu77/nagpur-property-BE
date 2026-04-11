import  Customer from '../../models/customer.model.js';
import storageService from '../../services/storage.service.js';

const customerService = {
  getProfile: async (customerId) => {
    const customer = await Customer.findById(customerId);
    if (!customer) throw { status: 404, message: 'Customer not found' };
    return customer;
  },

  updateProfile: async ( customerId, payload, file) => {
    let avatar;
    if (file) {
      const uploaded = await storageService.upload(file, 'avatars');
      avatar = uploaded?.url;
    }
    const customer = await Customer.findByIdAndUpdate(
       customerId,
      { ...payload, ...(avatar && { avatar }) },
      { new: true }
    );
    if (!customer) throw { status: 404, message: 'User not found' };
    return customer;
  },

  updateFcmToken: async (customerId, fcmToken) => {
    return Customer.findByIdAndUpdate(customerId, { fcmToken }, { new: true });
  },
};

export default customerService;