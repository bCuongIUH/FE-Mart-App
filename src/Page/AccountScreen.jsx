import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../untills/context/AuthContext'; // Import AuthContext
import { useNavigation } from '@react-navigation/native'; // Sử dụng để điều hướng

export default function AccountScreen() {
  const { logout } = useContext(AuthContext); 
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout(); 
      Alert.alert("Đăng xuất thành công", "Bạn đã đăng xuất khỏi tài khoản.");
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }], 
      });
    } catch (error) {
      Alert.alert("Lỗi", "Đăng xuất không thành công. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.centeredView}>
      <Text>Tài Khoản</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
