import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';


const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false); // User đã xác thực
    } else {
      navigation.replace('Login'); // Điều hướng sang Login nếu chưa xác thực
    }
  }, [user, navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator  size={50} color="#0000ff" />
      </View>
    );
  }

  return children;
};

export default RequireAuth;
