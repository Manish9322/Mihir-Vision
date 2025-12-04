
import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ['LinkedIn', 'Twitter', 'Other'],
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  socialLinks: {
      type: [socialLinkSchema],
      default: [],
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
  }
}, { timestamps: true });

const TeamMember = mongoose.models.TeamMember ?? mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
