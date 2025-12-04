
import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    required: true,
  },
}, { 
  timestamps: true,
  unique: ['name', 'country']
});

const State = mongoose.models.State ?? mongoose.model('State', stateSchema);

export default State;
