import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, StatusBar, Keyboard, TouchableWithoutFeedback, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { postRegister } from '../untills/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState(''); // Thêm state cho họ và tên
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Hàm xử lý đăng ký
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Xác nhận mật khẩu không khớp. Vui lòng thử lại.');
      return;
    }
  
    const data = {
      fullName, // Thêm họ và tên vào dữ liệu đăng ký
      email,
      phoneNumber,
      password,
    };
  
    try {
      const response = await postRegister(data);
      // console.log("API Response Status:", response.status);
  
      if (response.status === 200 || response.status === 201) {
      //   await AsyncStorage.setItem('tempEmail', email);
      // await AsyncStorage.setItem('tempPassword', password);
        navigation.navigate("OTP", { email });
      } else {
        Alert.alert("Registration Failed", response.data.message || "Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safeArea}
    >
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
            <Text style={styles.label}>Họ và Tên</Text>
            <TextInput 
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ và tên"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput 
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput 
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Nhập mật khẩu"
            />

            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput 
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Nhập lại mật khẩu"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
              <Text style={styles.loginButtonText}>Đăng kí</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Bạn đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}> Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Styles
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
    height: '70%', 
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
    color: '#4B5563',
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
