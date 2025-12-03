import mongoose from 'mongoose';

const imagePlaceholderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageHint: { type: String, required: true },
}, { _id: false });

const gallerySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageHint: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Gallery = mongoose.models.Gallery ?? mongoose.model('Gallery', gallerySchema);

export default Gallery;
