const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  area: {
    type: String,
    required: [true, 'Preferred area is required'],
    trim: true
    // Note: If you want strict data, you can enforce the 25 Nagpur localities here using an enum
  },
  budget: {
    type: String, 
    required: true,
    trim: true,
    // Storing as a string (e.g., '50L-60L') to match UI input. 
    // For advanced querying later, consider splitting this into budgetMin (Number) and budgetMax (Number).
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['New', 'Contacted',  'Closed'],
    default: 'New'
  },
  brokerId: {
    // Links the lead to the specific broker using the app
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, { 
  timestamps: true // This automatically handles the "Created Date" via mongoose's `createdAt` field
});

// Optional: Indexing for faster search performance on phone numbers and status
leadSchema.index({ status: 1 });
module.exports = mongoose.model('Lead', leadSchema);