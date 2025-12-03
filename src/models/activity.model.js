import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;
