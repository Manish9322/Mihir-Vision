
import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  year: {
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
  icon: {
    type: String, // Store icon name as string
    required: true,
  },
  order: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Timeline = mongoose.models.Timeline ?? mongoose.model('Timeline', timelineEventSchema);

export default Timeline;
