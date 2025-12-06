
import mongoose from 'mongoose';

const ImagePlaceholderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageHint: { type: String },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  image: {
    type: ImagePlaceholderSchema,
    required: true,
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

const Project = mongoose.models.Project ?? mongoose.model('Project', projectSchema);

export default Project;
