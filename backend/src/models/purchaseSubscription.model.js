import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  planId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plan', 
    required: true 
  },
  
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  
  // Status Management
  status: { 
    type: String, 
    enum: ['Active', 'Expired', 'Cancelled', 'Pending'], 
    default: 'Active' 
  },

  // Payment Reference (for Razorpay/Stripe integration)
  paymentDetails: {
    orderId: { type: String },
    paymentId: { type: String },
    amountPaid: { type: Number },
    method: { type: String } // e.g., 'UPI', 'Card'
  },

  // Usage Tracking (Counter for this specific billing cycle)
  usage: {
    propertiesPosted: { type: Number, default: 0 },
    leadsUnlocked: { type: Number, default: 0 },
    featuredPropertiesUsed: { type: Number, default: 0 }
  }
}, { timestamps: true });

 

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;