import customer from '../../models/customer.model';

const customerAuthRepository = {
  findCustomerByMobile: (mobile) => customer.findOne({ mobile }),

  findCustomerById: (id) => customer.findById(id),

  createCustomer: (payload) => customer.create(payload),

  updateCustomer: (id, update) => customer.findByIdAndUpdate(id, update, { new: true }),
};

export default customerAuthRepository;