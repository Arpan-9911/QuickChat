import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({ baseURL: 'http://192.168.31.128:5000' })
API.interceptors.request.use(async (req) => {
  const profile = await AsyncStorage.getItem('profile');
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
})

// Auth
export const sendOTP = (data) => API.post('/user/send-otp', data)
export const verifyOTP = (data) => API.post('/user/verify-otp', data)
export const createAccount = (formData) => API.post('/user/create', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
export const getAllUsers = () => API.get('/user/all')
export const updateProfile = (formData) => API.post('/user/update', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// Chats
export const getChats = (userId) => API.get(`/chats/${userId}`)
export const newChat = (data, userId) => API.post(`/chats/new/text/${userId}`, data)
export const newImage = (data, userId) => API.post(`/chats/new/image/${userId}`, data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
export const newFile = (data, userId) => API.post(`/chats/new/file/${userId}`, data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
export const markAsRead = (userId) => API.put(`/chats/mark-as-read/${userId}`)