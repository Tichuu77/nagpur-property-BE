import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
      maxlength: 100,
    },
    mobile: {
      type: String,
      required: [true, 'Please enter your mobile number'],
      match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    city: {
      type: String,
      default: 'Nagpur',
      trim: true,
      maxlength: 100,
    },
    area: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    // ─── Plan & Subscription ──────────────────────────────────────────────
    plan: {
      type: String,
      enum: {
        values: ['free', 'basic', 'premium', 'enterprise'],
        message: 'plan must be one of: free, basic, premium, enterprise',
      },
      default: 'free',
    },

    // Optional expiry date for paid plans (null = no expiry / free plan)
    planExpiry: {
      type: Date,
      default: null,
    },

    // ─── Misc ─────────────────────────────────────────────────────────────
    fcmToken:  { type: String },
    avatar:    { type: String },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);