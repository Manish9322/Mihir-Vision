
import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Country = mongoose.models.Country ?? mongoose.model('Country', countrySchema);

export default Country;
