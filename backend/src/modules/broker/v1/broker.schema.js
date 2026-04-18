import { z } from 'zod';

const brokerBaseSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),

  mobile: z
    .string({ required_error: 'Mobile is required' })
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),

  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .max(100, 'City cannot exceed 100 characters')
    .trim()
    .optional(),

  area: z
    .string()
    .max(100, 'Area cannot exceed 100 characters')
    .trim()
    .optional(),

  address: z
    .string()
    .max(200, 'Address cannot exceed 200 characters')
    .trim()
    .optional(),
});

export const createBrokerSchema = brokerBaseSchema;

// All fields optional for partial update
export const updateBrokerSchema = brokerBaseSchema.partial();