import { z } from 'zod';

const NAGPUR_LOCALITIES = [
  'Dharampeth', 'Sadar', 'Sitabuldi', 'Manish Nagar', 'Trimurti Nagar',
  'Besa', 'Wardha Road', 'Hingna Road', 'MIHAN', 'Mankapur',
  'Laxmi Nagar', 'Ramdaspeth', 'Bajaj Nagar', 'Pratap Nagar',
  'Kamptee Road', 'Wadi', 'Narendra Nagar', 'Nandanvan',
  'Koradi Road', 'Somalwada', 'Khamla', 'Ambazari',
  'Seminary Hills', 'Civil Lines', 'Godhni',
];

const PROPERTY_TYPES = ['Flat', 'House', 'Plot', 'Commercial', 'Apartment', 'Villa', 'Office'];
const LEAD_STATUSES  = ['New', 'Contacted', 'Closed'];

export const createLeadSchema = z.object({
  customerName: z
    .string({ required_error: 'Customer name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),

  phone: z
    .string({ required_error: 'Phone number is required' })
    .regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),

  propertyType: z.enum(PROPERTY_TYPES, {
    errorMap: () => ({ message: `Property type must be one of: ${PROPERTY_TYPES.join(', ')}` }),
  }),

  area: z.enum(NAGPUR_LOCALITIES, {
    errorMap: () => ({ message: 'Area must be a valid Nagpur locality' }),
  }),

  budget: z
    .string()
    .max(50, 'Budget cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),

  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),

  status: z
    .enum(LEAD_STATUSES, {
      errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }),
    })
    .optional()
    .default('New'),

  assignedBrokerId: z
    .string()
    .optional()
    .nullable(),

  source: z
    .enum(['admin', 'website', 'app', 'referral'])
    .optional()
    .default('admin'),
});

export const updateLeadSchema = createLeadSchema
  .partial()
  .extend({
    status: z
      .enum(LEAD_STATUSES, {
        errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }),
      })
      .optional(),
  });

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }),
  }),
});