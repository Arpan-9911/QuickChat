import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store/store';
import { getAllUsers } from './functions/users'
import { socket } from './socket';

import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MainTabs from './screens/MainTabs';
import ChatScreen from './screens/ChatScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import UserProfileScreen from './screens/UserProfileScreen';

const Stack = createNativeStackNavigator();

function AppInner() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.data?.user);

  useEffect(() => {
    if (!socket) return;
    socket.on('newUser', () => {
      dispatch(getAllUsers());
    });
    return () => {
      socket.off('newUser');
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem('profile');
        if (profile) {
          dispatch({ type: 'AUTH', payload: JSON.parse(profile) });
          dispatch(getAllUsers());
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  if (loading) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {user ? (
                <>
                  <Stack.Screen name="MainTabs" component={MainTabs} />
                  <Stack.Screen name="Chat" component={ChatScreen} />
                  <Stack.Screen name="MyProfile" component={MyProfileScreen} />
                  <Stack.Screen name="UserProfile" component={UserProfileScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}