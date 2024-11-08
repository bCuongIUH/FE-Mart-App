import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from "@ant-design/react-native/lib/toast/methods";

const API_URL = "http://192.168.1.10:5000/api";

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
//thay mật khẩu 
export const changePassword = async (data) => {
  try {
    const config = await getConfig(); 
    const res = await axios.post(`${API_URL}/auth/change-password`, data, config);
    return res;
  } catch (error) {
    console.error("Error changing password:", error.response?.data || error.message);
    throw error;
  }
};
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};
export const verifyForgotPasswordOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/auth/password-otp`, { email, otp });
    return response.data; // Sẽ trả về resetToken nếu OTP hợp lệ
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};
export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resetPassword`, { resetToken, newPassword });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw error;
  }
};


//sản phẩm
export const getAllPriceProduct = async () => {
  try {
    const response = await axios.get(`${API_URL}/price-list/priceall`);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi lấy bảng giá');
  }
};
//lấy toàn bộ vocher đang hoạt động

export const getAllActiveVouchers = async () => {
  try {
    const config = await getConfig(); 
    const response = await axios.get(`${API_URL}/voucher/promotion/list/active`, config);
    console.log("Danh sách voucher từ API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Chi tiết lỗi:", error.response ? error.response.data : error.message);
    throw new Error("Lỗi khi lấy danh sách voucher đang hoạt động");
  }
};

// Hàm gọi API để lấy danh sách khách hàng đang hoạt động
export const getAllCustomers = async () => {
  try {
     
      const response = await axios.get(`${API_URL}/customers/`, config);
      return response.data; 
  } catch (error) {
      console.error("Error fetching active customers:", error);
      throw error;
  }
};

export const updateCustomer = async (customerId, updatedData) => {
  try {
    const config = await getConfig();
    const response = await axios.put(`${API_URL}/customers/${customerId}`, updatedData, config);
    return response.data;
  } catch (error) {
    // Kiểm tra xem error có thuộc tính response không
    if (error.response) {
      console.error("Error response from API:", error.response.data); // Phản hồi từ API nếu có
    } else {
      console.error("Error updating customer:", error.message || error); // Lỗi khác nếu không có response
    }
    throw error;
  }
};
