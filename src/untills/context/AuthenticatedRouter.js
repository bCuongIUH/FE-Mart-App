import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RequireAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` để kiểm tra trạng thái ban đầu
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login'); // Điều hướng sang trang đăng nhập
      } else {
        setIsAuthenticated(true); // Xác thực thành công
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Hiển thị màn hình tải trong khi kiểm tra xác thực
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuthenticated ? children : null;
};

export default RequireAuth;
