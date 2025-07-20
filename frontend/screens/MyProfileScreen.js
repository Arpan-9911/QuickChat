import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../functions/users';

const MyProfileScreen = () => {
  const navigator = useNavigation();
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth?.data?.user);
  const dispatch = useDispatch();
  useEffect(() => {
    setName(currentUser?.profileName);
    setAbout(currentUser?.about);
    setImage(currentUser?.profilePic);
  }, [currentUser]);
  
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
  const handleUpdateAccount = async () => {
    if(!name.trim() || !about.trim()) return Alert.alert('Please enter name and about');
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profileName', name);
      formData.append('about', about);
      if (image && !image.startsWith('http')) {
        const fileName = image.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('profilePic', {
          uri: image,
          name: fileName,
          type: `image/${fileType}`,
        });
      }
      await dispatch(updateProfile(formData));
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully');
      navigator.navigate('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  }
  return currentUser && (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ marginTop: 20, fontSize: 16 }}>Updating your profile. Please wait...</Text>
            </View>
          ) : (
            <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
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
              <TouchableOpacity
                onPress={() => navigator.navigate('MainTabs')}
                style={{ position: 'absolute', top: 30, left: 20 }}
              >
                <Ionicons name="arrow-back" size={40} color="#fff" />
              </TouchableOpacity>
              <Text style={{ fontSize: 60, fontWeight: 'bold' }}>Update Profile</Text>
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
                  <>
                    <Image
                      source={{ uri: image }}
                      style={{ width: 80, height: 80, borderRadius: 100 }}
                    />
                    <Ionicons
                      name="camera"
                      size={30}
                      style={{ position: 'absolute', top: 50, right: 0 }}
                    />
                  </>
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
                  marginBottom: 10,
                  color: '#000'
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
                  marginBottom: 10,
                  color: '#000'
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
                onPress={handleUpdateAccount}
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

export default MyProfileScreen