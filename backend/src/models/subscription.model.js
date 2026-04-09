import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true },
    status: { type: String, default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
