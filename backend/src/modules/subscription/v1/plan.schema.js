import { z } from 'zod';

const limitsSchema = z.object({
  propertyUploads:              z.number({ coerce: true }).int().min(0).default(5),
  isPropertyUploadUnlimited:    z.boolean().default(false),
  featuredProperties:           z.number({ coerce: true }).int().min(0).default(0),
  isFeaturedPropertiesUnlimited: z.boolean().default(false),
  leadAccessCount:              z.number({ coerce: true }).int().min(0).default(10),
  prioritySupport:              z.boolean().default(false),
  analyticsAccess:              z.boolean().default(false),
}).optional();

export const createPlanSchema = z.object({
  name:                z.string().min(2, 'Name must be at least 2 characters').max(50),
  isFree:              z.boolean().default(false),
  price:               z.number({ coerce: true }).min(0, 'Price must be non-negative'),
  duration:            z.number({ coerce: true }).int().min(1, 'Duration must be at least 1'),
  durationUnit:        z.enum(['days', 'months', 'years']).default('months'),
  isDurationUnlimited: z.boolean().default(false),
  isLeadAccessUnlimited: z.boolean().default(false),
  description:         z.string().max(500).optional(),
  features:            z.array(z.string().max(100)).optional().default([]),
  limits:              limitsSchema,
  isActive:            z.boolean().default(true),
});

export const updatePlanSchema = createPlanSchema.partial();