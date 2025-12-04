
import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  isUnique: {
    type: Boolean,
    default: false,
  },
}, { 
  timestamps: true,
});

const Designation = mongoose.models.Designation ?? mongoose.model('Designation', designationSchema);

export default Designation;
