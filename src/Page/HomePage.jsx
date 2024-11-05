import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
// import { AuthContext } from '../untills/context/AuthContext';

const Tab = createBottomTabNavigator();
// const {user} = useContext(AuthContext)

// console.log(user)
function HomeScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Trang Chủ</Text>
    </View>
  );
}

function CartScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Giỏ Hàng</Text>
    </View>
  );
}

function ActivityScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Hoạt Động</Text>
    </View>
  );
}

function AccountScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Tài Khoản</Text>
    </View>
  );
}

export default function HomePage() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const { fullName } = JSON.parse(storedUser);
        setUserName(fullName);
      }
    };
    fetchUserName();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header với lời chào */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Chào mừng, {userName}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#A9A9A9"
          />
        </View>

        {/* Tabs điều hướng */}
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Trang Chủ') iconName = 'home';
              else if (route.name === 'Giỏ Hàng') iconName = 'shoppingcart';
              else if (route.name === 'Hoạt Động') iconName = 'bars';
              else if (route.name === 'Tài Khoản') iconName = 'user';

              return <AntDesign name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#FBBF24',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Trang Chủ" component={HomeScreen} />
          <Tab.Screen name="Giỏ Hàng" component={CartScreen} />
          <Tab.Screen name="Hoạt Động" component={ActivityScreen} />
          <Tab.Screen name="Tài Khoản" component={AccountScreen} />
        </Tab.Navigator>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#D8BFD8',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#4B5563',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
