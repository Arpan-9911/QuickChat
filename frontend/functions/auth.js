import * as api from './index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllUsers } from './users.js';

export const sendOTP = (authData) => async () => {
  try {
    await api.sendOTP(authData);
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Send OTP Failed!';
    return Promise.reject(new Error(message));
  }
}

export const verifyOTP = (authData, navigator) => async (dispatch) => {
  try {
    const {data} = await api.verifyOTP(authData);
    if (data.user && data.token) {
      dispatch({ type: 'AUTH', payload: data });
      await AsyncStorage.setItem('profile', JSON.stringify(data));
      navigator.navigate('MainTabs');
      dispatch(getAllUsers());
    }
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Verify OTP Failed!';
    return Promise.reject(new Error(message));
  }
}

export const createAccount = (formData) => async (dispatch) => {
  try {
    const { data } = await api.createAccount(formData);
    dispatch({ type: 'AUTH', payload: data });
    await AsyncStorage.setItem('profile', JSON.stringify(data));
    dispatch(getAllUsers());
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Create Account Failed!';
    return Promise.reject(new Error(message));
  }
}

export const logout = () => async (dispatch) => {
  try{
    await AsyncStorage.removeItem('profile');
    dispatch({ type: 'LOGOUT' });
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Logout Failed!';
    return Promise.reject(new Error(message));
  }
}