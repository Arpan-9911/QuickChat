import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const WelcomeScreen = () => {
  const user = useSelector((state) => state.auth?.data?.user) || null;
  useEffect(() => {
    if (user) {
      navigator.navigate('MainTabs');
    }
  })
  const navigator = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 50 }}>
      <Image
        source={require('../assets/welcome/bubble 01.png')}
        style={{ width: 100, height: 300, resizeMode: 'stretch', position: 'absolute', top: 100, right: 0 }}
      />
      <Image
        source={require('../assets/welcome/bubble 02.png')}
        style={{ width: 250, height: 250, resizeMode: 'stretch', position: 'absolute', top: 0, left: 0 }}
      />
      <Image
        source={require('../assets/logo.png')}
        style={{ width: 100, height: 100, resizeMode: 'stretch' }}
      />
      <Text
        style={{ fontSize: 60, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}
      >QuickChat</Text>
      <Text
        style={{ fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#888' }}
      >Connect with friends and the world around you on QuickChat</Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 10,
          borderRadius: 5,
          width: '100%',
          alignItems: 'center',
          marginTop: 50,
        }}
        onPress={() => {navigator.navigate('Login')}}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Let's Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}

export default WelcomeScreen