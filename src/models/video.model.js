import mongoose from 'mongoose';

const ImagePlaceholderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageHint: { type: String, required: true },
}, { _id: false });

const videoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  duration: { type: String, required: true },
  thumbnail: { type: ImagePlaceholderSchema, required: true },
  videoUrl: { type: String, required: true },
  order: { type: Number, required: true },
}, { timestamps: true });

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

export default Video;
