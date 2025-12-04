
import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: false });

const ActionLog = mongoose.models.ActionLog ?? mongoose.model('ActionLog', actionLogSchema);

export default ActionLog;
