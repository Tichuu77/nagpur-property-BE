import { z } from 'zod';

const brokerBaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  mobile: z
    .string()
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  city: z.string().max(100).optional(),
  area: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
});

export const createBrokerSchema = brokerBaseSchema;

export const updateBrokerSchema = brokerBaseSchema.partial();