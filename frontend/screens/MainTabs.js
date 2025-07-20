import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import UsersList from './tabs/UsersList';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  return (
    <View
      style={{
        paddingBottom: 5,
        borderBottomWidth: focused ? 2 : 0,
      }}
    >
      <Ionicons name={name} size={20} color={focused ? '#000' : '#007AFF'} />
    </View>
  );
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingTop: 10,
          paddingHorizontal: 20,
          height: 60,
        }
      }}
      initialRouteName='UsersList'
    >
      <Tab.Screen
        name="UsersList"
        component={UsersList}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'chatbox' : 'chatbox-outline'} focused={focused} />}}
      />
    </Tab.Navigator>
  );
}
