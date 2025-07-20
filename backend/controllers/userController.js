import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import Otp from '../models/otpModel.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import cloudinary from '../middleware/cloudinary.js'
import streamifier from 'streamifier';
import { getIO } from '../socket.js';

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email });
    const otpDoc = new Otp({ email, otp: otpCode });
    await otpDoc.save();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
    await transporter.sendMail({
      from: `"QuickChat" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Your OTP for QuickChat',
      text: `Your QuickChat OTP is: ${otpCode}. It will expire in 5 minutes.`
    });
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('sendOTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }
  try {
    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }
    if (otpDoc.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    await Otp.deleteOne({ _id: otpDoc._id });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: 'OTP verified. User exists.',
        user: existingUser,
        token
      });
    }
    res.status(200).json({ success: true, message: 'OTP verified successfully. Create Account' });
  } catch (error) {
    console.error('verifyOTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

export const createAccount = async (req, res) => {
  const { profileName, email, about } = req.body;
  const profilePicBuffer = req.file?.buffer;
  if (!email || !profileName) {
    return res.status(400).json({ success: false, message: 'Email and profile name are required.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }
    const folderPath = 'QuickChat/profilePics';
    let profilePicUrl = '';
    if(profilePicBuffer) {
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: folderPath }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
          streamifier.createReadStream(profilePicBuffer).pipe(stream);
        });
      const profilePicRes = await uploadStream();
      profilePicUrl = profilePicRes.secure_url;
    }
    const user = await User.create({ email, profileName, about, profilePic: profilePicUrl });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    getIO().emit('newUser', user);
    res.status(200).json({ success: true, message: 'Account created successfully', user, token });
  } catch (error) {
    console.error('CreateAccount error:', error);
    res.status(500).json({ success: false, message: 'Failed to create account' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { userId } = req
    const users = await User.find({ _id: { $ne: userId } });
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const lastMessage = await Chat.findOne({
        $or: [
          { sender: userId, receiver: user._id },
          { sender: user._id, receiver: userId }
        ]
      }).sort({ createdAt: -1 }).limit(1);
      const unseenMessages = await Chat.countDocuments({
        sender: user._id,
        receiver: userId,
        isRead: false
      })
      return {
        _id: user._id,
        profileName: user.profileName,
        email: user.email,
        about: user.about,
        profilePic: user.profilePic,
        lastMessage: lastMessage || null,
        unseenMessages: unseenMessages,
        lastMessageTime: lastMessage ? lastMessage.createdAt : null
      };
    }))
    enrichedUsers.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
    res.status(200).json({ success: true, message: 'Users fetched successfully', users: enrichedUsers });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const updateProfile = async (req, res) => {
  const { profileName, about } = req.body;
  const profilePicBuffer = req.file?.buffer;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (profilePicBuffer) {
      const folderPath = 'QuickChat/profilePics';
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: folderPath }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
          streamifier.createReadStream(profilePicBuffer).pipe(stream);
        });
      const profilePicRes = await uploadStream();
      user.profilePic = profilePicRes.secure_url;
    }
    user.profileName = profileName;
    user.about = about;
    await user.save();
    getIO().emit('updateProfile', user);
    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};