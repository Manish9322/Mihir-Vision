import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Client = mongoose.models.Client ?? mongoose.model('Client', clientSchema);

export default Client;
