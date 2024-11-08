import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../untills/context/AuthContext';
import { getAllCustomers } from '../untills/api';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const {logout , user } = useContext(AuthContext);
    const [customer, setCustomer] = useState(null);


  useEffect(() => {
    if (!user) return; // Thoát khỏi useEffect nếu user là null hoặc undefined
  
    const fetchCustomerData = async () => {
      try {
        // Logic để lấy dữ liệu
        const customerData = await getAllCustomers();
        const currentCustomer = customerData.find(cust => cust.CustomerId === user._id);
        if (currentCustomer) {
          setCustomer(currentCustomer);
        } else {
          Alert.alert("Không tìm thấy khách hàng", "Thông tin khách hàng chưa có trong hệ thống.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
  
    fetchCustomerData();
  }, [user]);
//   console.log(customer.email);

  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordScreen', { userId: user._id });
    console.log(user._id);
    
  };
  
//nút đăng xuất
const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          onPress: () => {
            logout();
            navigation.navigate("Login");
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ left: -20, top: 10 }}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
      </View>

      {/* Menu Items */}
     
      
      <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
        <Text style={styles.menuText}>Cài đặt/Cập nhật mật khẩu</Text>
      </TouchableOpacity>  
      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <Text style={styles.menuText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    top : 10,
    left :-20
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});
