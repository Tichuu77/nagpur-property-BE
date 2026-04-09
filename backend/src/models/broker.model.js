import mongoose from 'mongoose';

const brokerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Broker', brokerSchema);
