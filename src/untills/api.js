import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://192.168.1.62:5000/api";

// Hàm để tạo cấu hình axios với token
const getConfig = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Sử dụng hàm getConfig trong các yêu cầu API
export const postRegister = async (data) => {
  try {
    const config = await getConfig();
    const res = await axios.post(`${API_URL}/auth/register`, data, config);
    return res;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw error;
  }
};

// Các hàm API khác
export const postLogin = async (data) => {
  try {
    const config = await getConfig();
    const res = await axios.post(`${API_URL}/auth/login`, data, config);
    return res;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};
// Xác minh OTP
export const verifyOTP = async (data) => {
  try {
    const config = await getConfig();
    const res = await axios.post(`${API_URL}/auth/verify-otp`, data, config);
    return res;
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};

// Gửi lại OTP
export const resendOTP = async (email) => {
  try {
    const res = await axios.post(`${API_URL}/auth/resend-otp`, { email });
    return res;
  } catch (error) {
    console.error("Error resending OTP:", error.response?.data || error.message);
    throw error;
  }
};