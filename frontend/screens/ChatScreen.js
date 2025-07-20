import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useSelector, useDispatch } from 'react-redux';
import { newChat, newImage, newFile, markAsRead, getChats } from '../functions/chats';
import { socket } from '../socket';
import { getAllUsers } from '../functions/users';

const ChatScreen = ({ route, navigation }) => {
  const user = route?.params?.user || {};
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messages = useSelector(state => state.chats);
  const currentUser = useSelector(state => state.auth?.data?.user);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id || !socket) return;
    const handleNewChat = (chat) => {
      dispatch(getChats(user._id));
      dispatch(getAllUsers());
      dispatch(markAsRead(user._id));
    };
    socket.on('newChat', handleNewChat);
    return () => {
      socket.off('newChat', handleNewChat);
    };
  }, [dispatch, user?._id, markAsRead]);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setTyping(false);
    });
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setTyping(true);
    })
    return () => {
      keyboardHideListener.remove();
      keyboardShowListener.remove();
    };
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setLoading(true);
      try{
        const formData = new FormData();
        const image = result.assets[0].uri;
        const fileName = image.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('image', {
          uri: image,
          name: fileName,
          type: `image/${fileType}`,
        });
        await dispatch(newImage(formData, user._id));
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', error.message);
        setLoading(false);
      }
    }
  };

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      const fileUri = file.uri;
      const fileName = file.name || fileUri.split('/').pop();
      const fileExt = fileName.split('.').pop().toLowerCase();
      const mimeType = file.mimeType || `application/${fileExt}` || 'application/octet-stream';
      const formData = new FormData();
      formData.append('fileName', fileName);
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: mimeType,
      });
      setLoading(true);
      try {
        await dispatch(newFile(formData, user._id));
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    }
  };


  const handleSend = async () => {
    if (message.trim() === '') return;
    try{
      await dispatch(newChat({ message }, user._id));
      setMessage('');
    } catch (error) {
      Alert.alert('Error', error.message);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={typing ? 40 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              onPress={() => navigation.goBack()}
              style={{ marginRight: 10 }}
            />
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {user.profilePic ? (
                <Image
                  source={{ uri: user.profilePic }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#ddd',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="person" size={20} color="#777" />
                </View>
              )}
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {user.profileName || 'Unknown'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 15 }}>
              <Ionicons name="call" size={22} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="videocam" size={22} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <TouchableOpacity key={msg._id} activeOpacity={1}>
                <View
                  style={{
                    alignSelf: msg.sender === currentUser._id ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === currentUser._id ? '#DCF8C6' : '#eee',
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 8,
                    maxWidth: '80%',
                  }}
                >
                  {(msg.message && msg.message.length > 0) && (<Text>{msg.message}</Text>)}
                  {msg?.image && (
                    <TouchableOpacity onPress={() => Linking.openURL(msg.image)}>
                      <Image source={{ uri: msg.image }} style={{ width: 200, height: 200, resizeMode: 'contain' }} />
                    </TouchableOpacity>
                  )}
                  {msg?.file && (
                    <TouchableOpacity onPress={() => Linking.openURL(msg.file)}>
                      <Text>📄 {msg.fileName}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {loading ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', padding: 10, borderTopWidth: 1, borderTopColor: '#eee' }}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ fontSize: 16 }}>Sending ...</Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderTopWidth: 1,
                borderTopColor: '#eee',
                backgroundColor: '#fff',
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: '#eee',
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  maxHeight: 120,
                }}
                value={message}
                onChangeText={setMessage}
                onFocus={() => setTyping(true)}
                placeholder="Type a message"
                placeholderTextColor="#888"
                multiline
              />
              <TouchableOpacity onPress={handlePickImage} style={{ marginLeft: 10 }}>
                <Ionicons name="image-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePickFile} style={{ marginLeft: 10 }}>
                <Ionicons name="attach" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSend} style={{ marginLeft: 10, padding: 5 }}>
                <Ionicons name="send" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ChatScreen