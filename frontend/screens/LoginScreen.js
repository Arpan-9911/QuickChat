import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { sendOTP, verifyOTP, createAccount } from '../functions/auth';

const LoginScreen = () => {
  const user = useSelector((state) => state.auth?.data?.user) || null;
  useEffect(() => {
    if (user) {
      navigator.navigate('MainTabs');
    }
  })

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('Hey there! I am using QuickChat.');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const navigator = useNavigation();
  const dispatch = useDispatch();

  const handleSendOTP = () => {
    if(!email.trim()) return Alert.alert('Please enter email address');
    if (!/\S+@\S+\.\S+/.test(email)) return Alert.alert('Invalid Email', 'Please enter a valid email');
    try{
      dispatch(sendOTP({email}));
      setStep(2);
      Alert.alert('Success', 'OTP sent successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleVerifyOTP = async () => {
    if(!OTP || OTP.length !== 6) return Alert.alert('Please enter OTP');
    try{
      await dispatch(verifyOTP({email, otp: OTP}, navigator));
      setStep(3);
      Alert.alert('Success', 'OTP verified successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media is required!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Image Picker Error:', err);
    }
  };

  const handleCreateAccount = async () => {
    if (!name.trim()) return Alert.alert('Required','Please enter your name');
    try {
      setCreatingAccount(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('profileName', name);
      formData.append('about', about);
      if (image) {
        const fileName = image.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('profilePic', {
          uri: image,
          name: fileName,
          type: `image/${fileType}`,
        });
      }
      await dispatch(createAccount(formData));
      setCreatingAccount(false);
      navigator.navigate('MainTabs');
      Alert.alert('Success', 'Account created successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
      setCreatingAccount(false);
      navigator.navigate('Login');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 50 }}>
          <Image
            source={require('../assets/login/bubble 02.png')}
            style={{ width: 300, height: 300, resizeMode: 'stretch', position: 'absolute', top: 0, left: 0 }}
          />
          <Image
            source={require('../assets/login/bubble 01.png')}
            style={{ width: 250, height: 250, resizeMode: 'stretch', position: 'absolute', top: 0, left: 0 }}
          />
          <Image
            source={require('../assets/login/bubble 03.png')}
            style={{ width: 50, height: 120, resizeMode: 'stretch', position: 'absolute', top: 250, right: 0 }}
          />
          <Image
            source={require('../assets/login/bubble 04.png')}
            style={{ width: 250, height: 250, resizeMode: 'stretch', position: 'absolute', bottom: 0, right: 0 }}
          />
          <Text
            style={{ fontSize: 60, fontWeight: 'bold', marginTop: 20 }}
          >{step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Create Profile'}</Text>
          {step === 1 ? (
            <View style={{ width: '100%' }}>
              <Text
                style={{ fontSize: 16, marginBottom: 50 }}
              >Enter your email to request OTP</Text>
              <TextInput
                placeholder="Email"
                placeholderTextColor={'#999'}
                keyboardType="email-address"
                style={{
                  borderRadius: 100,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  width: '100%',
                  backgroundColor: '#eee',
                  marginBottom: 10
                }}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#007AFF',
                  padding: 10,
                  borderRadius: 5,
                  width: '100%',
                  alignItems: 'center',
                  marginTop: 50,
                }}
                onPress={handleSendOTP}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          ) : step === 2 ? (
            <View style={{ width: '100%' }}>
              <Text
                style={{ fontSize: 16, marginBottom: 50 }}
              >Enter the OTP sent to your email</Text>
              <TextInput
                placeholder="OTP"
                placeholderTextColor={'#999'}
                keyboardType="number-pad"
                maxLength={6}
                style={{
                  borderRadius: 100,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  width: '100%',
                  backgroundColor: '#eee',
                  marginBottom: 10
                }}
                value={OTP}
                onChangeText={(text) => setOTP(text)}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#007AFF',
                  padding: 10,
                  borderRadius: 5,
                  width: '100%',
                  alignItems: 'center',
                  marginTop: 50,
                }}
                onPress={handleVerifyOTP}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          ) : step === 3 && creatingAccount ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ marginTop: 20, fontSize: 16 }}>Creating your account. Please wait...</Text>
            </View>
          ) : (
            <View style={{ width: '100%', alignItems: 'flex-start' }}>
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                  padding: image ? 0 : 20,
                  borderWidth: image ? 0 : 2,
                  borderColor: '#007AFF',
                  borderStyle: 'dashed',
                }}
                onPress={pickImage}
              >
                {image ? (
                  <Image source={{ uri: image }} style={{ width: 80, height: 80, borderRadius: 100 }} />
                ) : (
                  <Ionicons name="camera" size={40} color="#007AFF" />
                )}
              </TouchableOpacity>
              <TextInput
                placeholder="Profile Name"
                placeholderTextColor={'#999'}
                style={{
                  borderRadius: 100,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  width: '100%',
                  backgroundColor: '#eee',
                  marginBottom: 10
                }}
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <TextInput
                placeholder='About you'
                placeholderTextColor={'#999'}
                style={{
                  borderRadius: 100,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  width: '100%',
                  backgroundColor: '#eee',
                  marginBottom: 10
                }}
                value={about}
                onChangeText={(text) => setAbout(text)}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#007AFF',
                  padding: 10,
                  borderRadius: 5,
                  width: '100%',
                  alignItems: 'center',
                  marginTop: 50,
                }}
                onPress={handleCreateAccount}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen