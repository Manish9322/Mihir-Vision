// This model is obsolete and will be removed. The new logic is in /models/match.model.js.
import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Game = mongoose.models.Game ?? mongoose.model('Game', gameSchema);

export default Game;
