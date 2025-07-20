import { io } from 'socket.io-client';
const BACKEND_URL = 'https://quickchat-mobileapp.onrender.com';

export const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  autoConnect: true
});