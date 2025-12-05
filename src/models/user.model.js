import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
}, { _id: false });

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: addressSchema,
  socialLinks: {
    type: [socialLinkSchema],
    default: [],
  },
}, { timestamps: true });

const User = mongoose.models.User ?? mongoose.model('User', userSchema);

export default User;
