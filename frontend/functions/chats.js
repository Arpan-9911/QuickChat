import * as api from './index.js';
import { getAllUsers } from './users.js';

export const getChats = (userId) => async (dispatch) => {
  try {
    const { data } = await api.getChats(userId);
    dispatch({ type: 'GET_CHATS', payload: data.chats });
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Get Chats Failed!';
    return Promise.reject(new Error(message));
  }
};

export const newChat = (formData, userId) => async (dispatch) => {
  try {
    const { data } = await api.newChat(formData, userId);
    dispatch({ type: 'ADD_CHAT', payload: data.chat });
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'New Chat Failed!';
    return Promise.reject(new Error(message));
  }
};

export const newImage = (formData, userId) => async (dispatch) => {
  try {
    const { data } = await api.newImage(formData, userId);
    dispatch({ type: 'ADD_CHAT', payload: data.chat });
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'New Image Failed!';
    return Promise.reject(new Error(message));
  }
};

export const newFile = (formData, userId) => async (dispatch) => {
  try {
    const { data } = await api.newFile(formData, userId);
    dispatch({ type: 'ADD_CHAT', payload: data.chat });
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'New File Failed!';
    return Promise.reject(new Error(message));
  }
};

export const markAsRead = (userId) => async (dispatch) => {
  try {
    await api.markAsRead(userId);
    dispatch({ type: 'MARK_AS_READ', payload: null });
    dispatch(getAllUsers());
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Mark As Read Failed!';
    return Promise.reject(new Error(message));
  }
};