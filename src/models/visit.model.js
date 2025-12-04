
import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, index: true },
  page: { type: String, required: true },
  ipAddress: { type: String },
  deviceType: { type: String },
  browser: { type: String },
  os: { type: String },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date },
  duration: { type: Number }, // in seconds
}, { timestamps: true });

const Visit = mongoose.models.Visit ?? mongoose.model('Visit', visitSchema);

export default Visit;
