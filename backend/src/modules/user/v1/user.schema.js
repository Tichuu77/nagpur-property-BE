import { z } from 'zod';

const VALID_PLANS = ['free', 'basic', 'premium', 'enterprise'];

/**
 * Base fields shared across create and update
 */
const userBaseSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),

  mobile: z
    .string({ required_error: 'Mobile number is required' })
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

/**
 * Schema for creating a user (all required fields must be present)
 */
export const createUserSchema = userBaseSchema;

/**
 * Schema for updating a user (all fields optional for partial update)
 * Allows updating plan and isActive in addition to base fields
 */
export const updateUserSchema = userBaseSchema
  .partial()
  .extend({
    plan: z
      .enum(['free', 'basic', 'premium', 'enterprise'], {
        errorMap: () => ({ message: `plan must be one of: ${VALID_PLANS.join(', ')}` }),
      })
      .optional(),

    isActive: z.boolean().optional(),

    planExpiry: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'planExpiry must be YYYY-MM-DD format')
      .optional()
      .or(z.null()),
  });