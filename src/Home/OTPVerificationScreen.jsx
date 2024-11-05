import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resendOTP, verifyOTP } from '../untills/api';

export default function OTPVerificationScreen({ route, navigation }) {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { email } = route.params;

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else {
      setIsResendDisabled(false); 
    }

    return () => clearInterval(countdown);
  }, [timer]);

  const handleResendOTP = async () => {
    setTimer(60); // Đặt lại thời gian đếm ngược
    setIsResendDisabled(true);
    try {
      await resendOTP(email); // Gọi API gửi lại OTP
    //   Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      try {
        const response = await verifyOTP({ email, otp });
        if (response.status === 200) {
          Alert.alert("Success", "Xác thực thành công!");
          navigation.navigate("HomePage");
        }
      } catch (error) {
        Alert.alert("Invalid OTP", error.response?.data?.message || "The OTP entered is incorrect.");
      }
    } else {
      Alert.alert("Invalid OTP", "Please enter a 6-digit OTP.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#D8BFD8" />

      <View style={styles.container}>
        <Text style={styles.title}>Nhập mã OTP</Text>
        <Text style={styles.subtitle}>Mã OTP đã được gửi qua email của bạn!</Text>

        <TextInput
          style={styles.otpInput}
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
          keyboardType="numeric"
          placeholder="Nhập OTP"
          placeholderTextColor="#A9A9A9"
          textAlign="center"
        />

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
          <Text style={styles.verifyButtonText}>Xác nhận</Text>
        </TouchableOpacity>

        {isResendDisabled ? (
          <Text style={styles.timerText}>Gửi lại sau {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendText}>Gửi lại</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D8BFD8',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInput: {
    height: 50,
    width: '80%',
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 10,
    fontSize: 20,
    paddingHorizontal: 16,
    color: '#4B5563',
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
  },
  verifyButton: {
    width: '80%',
    paddingVertical: 12,
    backgroundColor: '#FBBF24',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerText: {
    fontSize: 16,
    color: '#4B5563',
  },
  resendText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
