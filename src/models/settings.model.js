
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
  siteLogoUrl: {
    type: String,
    default: '',
  },
  faviconUrl: {
    type: String,
    default: '',
  }
}, { timestamps: true });

const Settings = mongoose.models.Settings ?? mongoose.model('Settings', settingsSchema);

export default Settings;
