import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  profileName: {
    type: String,
    required: true,
    trim: true
  },
  about: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default: ''
  },
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);