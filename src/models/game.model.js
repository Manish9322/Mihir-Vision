
import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  coverImageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  platforms: {
    type: [String],
    default: [],
  },
  websiteUrl: {
    type: String,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
  }
}, { timestamps: true });

const Game = mongoose.models.Game ?? mongoose.model('Game', gameSchema);

export default Game;
