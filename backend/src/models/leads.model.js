import mongoose from 'mongoose';

const NAGPUR_LOCALITIES = [
  'Dharampeth', 'Sadar', 'Sitabuldi', 'Manish Nagar', 'Trimurti Nagar',
  'Besa', 'Wardha Road', 'Hingna Road', 'MIHAN', 'Mankapur',
  'Laxmi Nagar', 'Ramdaspeth', 'Bajaj Nagar', 'Pratap Nagar',
  'Kamptee Road', 'Wadi', 'Narendra Nagar', 'Nandanvan',
  'Koradi Road', 'Somalwada', 'Khamla', 'Ambazari',
  'Seminary Hills', 'Civil Lines', 'Godhni',
];

const PROPERTY_TYPES = [
  'Flat', 'House', 'Plot', 'Commercial', 'Apartment', 'Villa', 'Office',
];

const LEAD_STATUSES = ['New', 'Contacted', 'Closed'];

const leadSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{10}$/, 'Enter a valid 10-digit phone number'],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: PROPERTY_TYPES,
        message: `Property type must be one of: ${PROPERTY_TYPES.join(', ')}`,
      },
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      enum: {
        values: NAGPUR_LOCALITIES,
        message: `Area must be one of the valid Nagpur localities`,
      },
    },
    budget: {
      type: String,
      trim: true,
      maxlength: [50, 'Budget cannot exceed 50 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message: `Status must be one of: ${LEAD_STATUSES.join(', ')}`,
      },
      default: 'New',
    },
    assignedBrokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    source: {
      type: String,
      default: 'admin',
      enum: ['admin', 'website', 'app', 'referral'],
    },
  },
  { timestamps: true }
);

// Indexes for fast lookup
leadSchema.index({ status: 1 });
leadSchema.index({ area: 1 });
leadSchema.index({ propertyType: 1 });
leadSchema.index({ assignedBrokerId: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({
  customerName: 'text',
  phone: 'text',
  notes: 'text',
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;