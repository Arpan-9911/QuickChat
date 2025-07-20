import { io } from 'socket.io-client';
const BACKEND_URL = 'http://192.168.31.128:5000';

export const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  autoConnect: true
});