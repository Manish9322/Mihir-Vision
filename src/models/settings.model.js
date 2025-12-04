
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'Pinnacle Pathways'
  },
  siteTagline: {
    type: String,
    default: 'Forging new paths to the peak of innovation.'
  },
  countries: {
    type: [String],
    default: ['USA', 'Canada', 'UK']
  },
  states: {
    type: [String],
    default: ['California', 'New York', 'Texas']
  },
  cities: {
    type: [String],
    default: ['San Francisco', 'New York City', 'London']
  }
}, { timestamps: true });

const Settings = mongoose.models.Settings ?? mongoose.model('Settings', settingsSchema);

export default Settings;
