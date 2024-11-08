import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { forgotPassword, verifyForgotPasswordOTP, resetPassword } from '../untills/api';
import { MaterialIcons } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleRequestOTP = async () => {
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      Alert.alert("Thành công", response.message);
      setStep(2); 
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra khi yêu cầu OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await verifyForgotPasswordOTP(email, otp);
      setResetToken(response.resetToken);
      setStep(3); 
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "OTP không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      Alert.alert("Thành công", "Mật khẩu đã được đặt lại thành công");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" /> 
        </TouchableOpacity>
        <Text style={styles.title}>Quên Mật Khẩu</Text>
      </View>
      
      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleRequestOTP} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Xác nhận</Text>}
          </TouchableOpacity>
        </>
      )}

        {step === 2 && (
        <>
            <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            value={otp}
            onChangeText={(text) => {
                // Giới hạn ký tự và chỉ cho phép số
                if (/^\d*$/.test(text) && text.length <= 6) {
                setOtp(text);
                }
            }}
            keyboardType="number-pad"
            maxLength={6} // Giới hạn tối đa 6 ký tự
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Xác Minh OTP</Text>}
            </TouchableOpacity>
        </>
        )}


      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Cập Nhật Mật Khẩu</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 40,
    backgroundColor: '#f2f2f2',
  },
  goBackButton: {
    marginRight: 10,
    top : 10,
    left : -20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    top : 10,
    left : -20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    // top: 10,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#D8BFD8",
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
    top: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
