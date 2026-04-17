import mongoose from 'mongoose';

const staticPageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      enum: ['about-us', 'privacy-policy', 'terms-and-conditions', 'contact-us'],
      index: true,
    },
    title: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('StaticPage', staticPageSchema);