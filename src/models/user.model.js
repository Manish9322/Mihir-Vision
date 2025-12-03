import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'Administrator',
  },
  avatarUrl: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: addressSchema,
}, { timestamps: true });

const User = mongoose.models.User ?? mongoose.model('User', userSchema);

export default User;
