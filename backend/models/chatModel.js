import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  sender: {
    type: String,
    ref: 'User',
    required: true
  },
  receiver: {
    type: String,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  file: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Chat', chatSchema);
