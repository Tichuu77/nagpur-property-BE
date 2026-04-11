import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      required: [true, 'Please enter your name'],
      maxlength: [30, 'Name cannot exceed 30 characters'],
      trim: true 
      },
    mobile: {
       type: String, 
       match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'], 
       trim: true, 
       unique: true, 
       sparse: true ,
       required: [true, 'Please enter your mobile number'],
       index: true
      },
    isActive: { type: Boolean, default: true },
    fcmToken: { type: String },
    avatar: { type: String },
    address: { type: String, maxlength: [200, 'Address cannot exceed 200 characters'] },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);


 
export default mongoose.model('User', userSchema);