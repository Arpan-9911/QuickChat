import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native'
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

const UserProfileScreen = ({route, navigation}) => {
  const user = route?.params?.user || {};
  const messages = useSelector(state => state.chats);
  const [sharedImages, setSharedImages] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [display, setDisplay] = useState('Images');

  useEffect(() => {
    if(!messages) return;
    const filteredImages = messages.filter(msg => msg.image?.trim() !== '');
    const filteredFiles = messages.filter(msg => msg.file?.trim() !== '')
    setSharedImages(filteredImages);
    setSharedFiles(filteredFiles);
  }, [messages]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50, }}>
      <Image
        source={require('../assets/login/bubble 02.png')}
        style={{ width: 250, height: 250, resizeMode: 'stretch', position: 'absolute', top: 0, left: 0 }}
      />
      <Image
        source={require('../assets/login/bubble 01.png')}
        style={{ width: 150, height: 150, resizeMode: 'stretch', position: 'absolute', top: 0, left: 0 }}
      />
      <Image
        source={require('../assets/login/bubble 03.png')}
        style={{ width: 50, height: 120, resizeMode: 'stretch', position: 'absolute', top: 250, right: 0 }}
      />
      <Image
        source={require('../assets/login/bubble 04.png')}
        style={{ width: 250, height: 250, resizeMode: 'stretch', position: 'absolute', bottom: 0, right: 0 }}
      />
      <Image
        source={{ uri: user.profilePic }}
        style={{ width: 100, height: 100, borderRadius: 100, alignSelf: 'center', borderWidth: 3, borderColor: '#007AFF' }}
      />
      <Ionicons
        name="arrow-back"
        size={24}
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 30, left: 20 }}
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>{user.profileName}</Text>
      <Text style={{ fontSize: 16, textAlign: 'center', color: '#333', marginBottom: 20 }}>{user.about}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 20 }}>
        <TouchableOpacity
          onPress={() => setDisplay('Images')}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
        >
          <Ionicons name="images" size={24} color={display === 'Images' ? '#007AFF' : '#333'} />
          <Text style={{ fontSize: 16, marginLeft: 5, fontWeight: 'bold', color: display === 'Images' ? '#007AFF' : '#333' }}>Images</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDisplay('Files')}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
        >
          <Ionicons name="document-text" size={24} color={display === 'Files' ? '#007AFF' : '#333'} />
          <Text style={{ fontSize: 16, marginLeft: 5, fontWeight: 'bold', color: display === 'Files' ? '#007AFF' : '#333' }}>Files</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }}>
          {display === 'Images' && sharedImages.map((img, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(img.image)}
              style={{ width: '48%', height: 150, borderRadius: 10, padding: 10, backgroundColor: '#eee', overflow: 'hidden' }}
              activeOpacity={1}
            >
              <Image
                source={{ uri: img.image }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          ))}
          {display === 'Files' && sharedFiles.map((file, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(file.file)}
              style={{ width: '48%', borderRadius: 10, backgroundColor: '#eee', padding: 10 }}
              activeOpacity={1}
            >
              <Text>{file.fileName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  ) 
}

export default UserProfileScreen