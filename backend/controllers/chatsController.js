import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import cloudinary from '../middleware/cloudinary.js'
import streamifier from 'streamifier';
import { getIO } from '../socket.js';

export const getAllChats = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const user = await User.findById(userId);
    const receiver = await User.findById(id);
    if (!user || !receiver) {
      return res.status(404).json({ success: false, message: 'Users not found' });
    }
    const chats = await Chat.find({
      $or: [
        {sender: user._id, receiver: receiver._id },
        {sender: receiver._id, receiver: user._id }
      ]
    });
    res.status(200).json({ success: true, message: 'Chats fetched successfully', chats: chats || [] });
  } catch (error) {
    console.error('GetAllChats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chats' });
  }
};

export const newChat = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { userId } = req;
    const { message } = req.body;
    const sender = await User.findById(userId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: 'Users not found' });
    }
    const chat = await Chat.create({ sender: sender._id, receiver: receiver._id, message });
    getIO().emit('newChat', chat);
    res.status(200).json({ success: true, message: 'Chat created successfully', chat });
  } catch (error) {
    console.error('NewChat error:', error);
    res.status(500).json({ success: false, message: 'Failed to create chat' });
  }
};

export const newImage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { userId } = req;
    const imageBuffer = req.file?.buffer;
    const sender = await User.findById(userId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: 'Users not found' });
    }
    const folderPath = 'QuickChat/Chats';
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: folderPath }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
        streamifier.createReadStream(imageBuffer).pipe(stream);
      });
    const imageRes = await uploadStream();
    const chat = await Chat.create({ sender: sender._id, receiver: receiver._id, image: imageRes.secure_url });
    getIO().emit('newChat', chat);
    res.status(200).json({ success: true, message: 'Chat created successfully', chat });
  } catch (error) {
    console.error('NewChat error:', error);
    res.status(500).json({ success: false, message: 'Failed to create chat' });
  }
};

export const newFile = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { userId } = req;
    const fileBuffer = req.file?.buffer;
    const { fileName } = req.body;
    const mimeType = req.file.mimetype;
    let resourceType = 'raw';
    if (mimeType.startsWith('image/')) resourceType = 'image';
    else if (mimeType.startsWith('video/')) resourceType = 'video';
    const sender = await User.findById(userId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: 'Users not found' });
    }
    const folderPath = 'QuickChat/Chats';
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: resourceType, folder: folderPath }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    const fileRes = await uploadStream();
    const chat = await Chat.create({ sender: sender._id, receiver: receiver._id, file: fileRes.secure_url, fileName });
    getIO().emit('newChat', chat);
    res.status(200).json({ success: true, message: 'Chat created successfully', chat });
  } catch (error) {
    console.error('NewChat error:', error);
    res.status(500).json({ success: false, message: 'Failed to create chat' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const { userId } = req;
    const sender = await User.findById(senderId);
    const receiver = await User.findById(userId);
    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: 'Users not found' });
    }
    await Chat.updateMany({ sender: sender._id, receiver: receiver._id }, { $set: { isRead: true } });
    res.status(200).json({ success: true, message: 'Chat marked as read successfully' });
  } catch (error) {
    console.error('MarkAsRead error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark chat as read' });
  }
};