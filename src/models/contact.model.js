
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Replied'],
    default: 'New',
  },
}, { timestamps: true });

const Contact = mongoose.models.Contact ?? mongoose.model('Contact', contactSchema);

export default Contact;
