import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  paragraph1: {
    type: String,
    required: true,
  },
  highlights: {
    type: [String],
    required: true,
  },
  image: {
    imageUrl: {
      type: String,
      required: true,
    },
    description: String,
  },
}, { timestamps: true });

const About = mongoose.models.About ?? mongoose.model('About', aboutSchema);

export default About;
