import * as api from './index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllUsers = () => async (dispatch) => {
  try {
    const { data } = await api.getAllUsers();
    dispatch({ type: 'GET_USERS', payload: data.users });
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Get All Users Failed!';
    return Promise.reject(new Error(message));
  }
};

export const updateProfile = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateProfile(formData);
    const updatedUser = data.user;
    dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
    const storedProfile = await AsyncStorage.getItem('profile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      profile.user = updatedUser;
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
    }
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Update Profile Failed!';
    return Promise.reject(new Error(message));
  }
};