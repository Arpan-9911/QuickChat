import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Image, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { use, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../functions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { getChats, markAsRead } from '../../functions/chats';

const UsersList = () => {
  const [isMenu, setIsMenu] = useState(false);
  const [searched, setSearched] = useState('');
  const navigator = useNavigation();
  const dispatch = useDispatch();
  const users = useSelector(state => state.users) || [];
  const filteredUsers = users.filter(user =>
    user.profileName.toLowerCase().includes(searched.toLowerCase())
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChat = (user) => {
    navigator.navigate('Chat', { user });
    setIsMenu(false);
    setSearched('');
    Keyboard.dismiss();
    dispatch(getChats(user._id));
    dispatch(markAsRead(user._id));
  }
  return users && (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(), setIsMenu(false)}}>
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>QuickChat</Text>
            <Ionicons
              name={isMenu ? 'close' : 'menu'}
              size={30}
              color="black"
              onPress={() => setIsMenu(!isMenu)}
            />
            {isMenu && (<View style={{ position: 'absolute', top: 40, right: 5, padding: 15, backgroundColor: '#fff', borderRadius: 5, gap: 10, zIndex: 1, elevation: 5 }}>
              <TouchableOpacity onPress={() => {navigator.navigate('MyProfile'), setIsMenu(false)}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Profile</Text>
              </TouchableOpacity>
              <View style={{ height: 1, backgroundColor: '#000' }}></View>
              <TouchableOpacity onPress={() => {handleLogout(), setIsMenu(false)}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
              </TouchableOpacity>
            </View>)}
          </View>
          <View style={{ marginTop: 10, position: 'relative' }}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#999"
              style={{
                backgroundColor: '#eee',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                marginBottom: 10,
                borderRadius: 100
              }}
              value={searched}
              onChangeText={(text) => setSearched(text)}
            />
            <Ionicons
              name="search"
              size={20}
              style={{ position: 'absolute', top: 10, right: 10 }}
            />
          </View>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user._id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}
                onPress={() => handleChat(user)}
              >
                {user.profilePic ? (
                  <Image
                    source={{ uri: user.profilePic }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 10,
                    }}
                  />
                ) : (
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#ddd',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                    <Ionicons name="person" size={24} color="#777" />
                  </View>
                )}
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{user.profileName}</Text>
                  {(user.lastMessage && <Text
                    style={{ color: '#777', fontSize: 14, maxWidth: 220 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {user.lastMessage.message ? user.lastMessage.message : user.lastMessage.image ? 'Image' : user.lastMessage.file ? 'File' : ''}
                  </Text>)}
                </View>
                {(user.unseenMessages > 0 && <View style={{ position: 'absolute', top: 20, right: 10, width: 25, height: 25, borderRadius: 100, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>{user.unseenMessages}</Text>
                </View>)}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default UsersList