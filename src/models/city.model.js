
import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    required: true,
  },
}, { 
  timestamps: true,
  unique: ['name', 'state']
});

const City = mongoose.models.City ?? mongoose.model('City', citySchema);

export default City;
