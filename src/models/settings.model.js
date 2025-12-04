
import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: false });

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  country: { type: String, required: true },
}, { _id: false });

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  state: { type: String, required: true },
}, { _id: false });

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
    type: [countrySchema],
    default: [{ name: 'USA', description: 'United States of America' }]
  },
  states: {
    type: [stateSchema],
    default: [{ name: 'California', description: 'The Golden State', country: 'USA' }]
  },
  cities: {
    type: [citySchema],
    default: [{ name: 'San Francisco', description: 'City by the Bay', state: 'California' }]
  }
}, { timestamps: true });

const Settings = mongoose.models.Settings ?? mongoose.model('Settings', settingsSchema);

export default Settings;
