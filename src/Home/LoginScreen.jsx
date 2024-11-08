import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, StatusBar, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { postLogin } from '../untills/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../untills/context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const { login } = useContext(AuthContext); 

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await postLogin({ email, password });
      if (response.status === 200) {
        const token = response.data.token;
        const userData = response.data.user;
  
        // Lưu token và user vào AsyncStorage
        await AsyncStorage.setItem('token', token);
  
        // Gọi hàm login từ AuthContext để lưu user vào context
        login(userData);
  
        navigation.navigate("HomePage");
      } else {
        Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu sai. Vui lòng thử lại.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      Alert.alert("Đăng nhập thất bại", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#D8BFD8" />

        {/* Phần trên với nền màu tím nhạt */}
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AntDesign name="back" size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/images/login.png')}
              style={styles.imageStyle}
            />
          </View>
        </View>

        {/* Phần dưới với nền trắng */}
        <View style={styles.bottomContainer}>
        <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập Email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput 
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Nhập mật khẩu"
          />

          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu ?</Text>
          </TouchableOpacity>

          {/* Nút đăng nhập */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" /> // Hiển thị loader khi đăng nhập
            ) : (
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Bạn chưa có tài khoản ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.loginText}> Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D8BFD8',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%', 
    backgroundColor: '#D8BFD8', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%', 
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 24,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D8BFD8',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FBBF24',
    padding: 8,
    borderRadius: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 16,
    marginTop: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    borderRadius: 50, 
    overflow: 'hidden', 
    borderWidth: 4,
    borderColor: 'rgba(216, 191, 216, 0.5)', 
  },
  imageStyle: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  label: {
    color: '#4B5563',
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 4,
  },
  input: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    borderRadius: 16,
    marginBottom: 12,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4B5563',
  },
  loginButton: {
    paddingVertical: 12,
    backgroundColor: '#FBBF24',
    borderRadius: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footerContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 16,
  },
  footerText: {
    marginTop :5,
    color: 'black', 
    fontWeight: '600', 
  },
  loginText: {
    marginTop :5,
    fontWeight: '600', 
    color: '#F59E0B',
  },
});
