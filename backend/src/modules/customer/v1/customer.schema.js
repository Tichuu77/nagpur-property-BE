import zod from 'zod';


const customerBaseSchema = zod.object({
  name: zod.string().required().min(1, 'Name is required').max(30, 'Name cannot exceed 30 characters'),
  mobile: zod.string().required().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number'),
  address: zod.string().max(200, 'Address cannot exceed 200 characters').optional(),
});

export const createCustomerSchema = customerBaseSchema;

export const refreshTokenSchema = zod.object({
  refreshToken: zod.string().required('Refresh token is required'),
});

export const getMeSchema = zod.object({
  userId: zod.string().required('User ID is required'),
});

export const updateCustomerSchema = customerBaseSchema.partial();

