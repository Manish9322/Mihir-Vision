
import mongoose from 'mongoose';

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  // Default event types for this sport
  eventTypes: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const Sport = mongoose.models.Sport ?? mongoose.model('Sport', sportSchema);

export default Sport;
