import { View, Text, ScrollView, Image } from 'react-native'

const sharedImages = [
  require('../assets/profile/1.png'),
  require('../assets/profile/2.png'),
  require('../assets/profile/3.png'),
  require('../assets/profile/4.png'),
  require('../assets/profile/5.png'),
  require('../assets/profile/6.png'),
  require('../assets/profile/7.png'),
]

const UserProfileScreen = () => {
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
        source={require('../assets/profile/1.png')}
        style={{ width: 100, height: 100, borderRadius: 100, alignSelf: 'center', borderWidth: 3, borderColor: '#007AFF' }}
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>Arpan Kumar</Text>
      <Text style={{ fontSize: 16, textAlign: 'center', color: '#333', marginBottom: 20 }}>Hey there! I am using QuickChat.</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }}>
          {sharedImages.map((img, index) => (
            <Image
              key={index}
              source={img}
              style={{
                width: '48%',
                height: 150,
                borderRadius: 10,
                resizeMode: 'stretch',
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  ) 
}

export default UserProfileScreen