import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from '@expo/vector-icons/AntDesign';
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import ActivityScreen from './ActivityScreen';
import AccountScreen from './AccountScreen';

const Tab = createBottomTabNavigator();

export default function HomePage() { 
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
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
            tabBarActiveTintColor: '#ffcc00',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            gestureEnabled: true,
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
    backgroundColor: '#ffcc00',
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
});
