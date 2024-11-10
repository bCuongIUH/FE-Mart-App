import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AuthContext } from '../untills/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getAllCustomers } from '../untills/api';

export default function AccountScreen() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [customer, setCustomer] = useState([]);


  // Lấy thông tin sản phẩm và khách hàng
  const fetchCustomer = async () => {
    try {
      const customerData = await getAllCustomers();
      const currentCustomer = customerData.find(cust => cust.CustomerId === user._id);
      if (currentCustomer) {
        setCustomer(currentCustomer);
      } else {
        Alert.alert("Không tìm thấy khách hàng", "Thông tin khách hàng chưa có trong hệ thống.");
      }
    } catch (err) {
      console.error("Error fetching customer data:", err);
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện khi màn hình được focus trở lại
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCustomer();
    });

    // Dọn dẹp sự kiện khi component bị hủy
    return unsubscribe;
  }, [navigation, user]);


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
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            });
          } 
        }
      ]
    );
  };

  //nút edit
  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen', { customer });
  };


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <Image  source={require('../../assets/images/man-avatar.jpg')} style={styles.avatar} />
          <Text style={styles.name}>{customer ? customer.fullName : "Người dùng"} </Text>
          <Text style={styles.phone}>{user?.phoneNumber}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>THÀNH VIÊN</Text>
          </View>
          {/* Nút chỉnh sửa */}
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <FontAwesome name="edit" size={24} color="#333" />
          </TouchableOpacity>
        </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <MenuItem icon="money" label="Quản lý chi tiêu" isNew />
        <MenuItem icon="calendar" label="Kế hoạch mua sắm" isNew />
        {/* <MenuItem icon="wallet" label="Ví trả sau – bePaylater" isNew /> */}
        {/* <MenuItem icon="home" label="Home PayLater" isNew /> */}
        {/* <MenuItem icon="link" label="Liên kết tài khoản" /> */}
        {/* <MenuItem icon="car" label="Cài đặt chuyến đi" /> */}
        {/* <MenuItem icon="shield" label="Bảo hiểm OPES" /> */}
        <MenuItem icon="tag" label="Khuyến mãi" />
        {/* <MenuItem icon="piggy-bank" label="Gói tiết kiệm" /> */}
        <MenuItem icon="gift" label="Giới thiệu & Nhận ưu đãi" />
        <MenuItem icon="cog" label="Cài đặt" onPress={() => navigation.navigate('SettingsScreen')}/>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MenuItem({ icon, label, isNew, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <FontAwesome name={icon} size={20} color="#555" style={styles.menuIcon} />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      {isNew && <Text style={styles.newBadge}>Mới</Text>}
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#ffcc00',
    alignItems: 'center',
    paddingVertical: 40,
  },
  editButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    margin: 5,
  },
  phone: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  memberBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  memberText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  newBadge: {
    backgroundColor: '#FF4500',
    color: '#FFF',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  logoutButton: {
    top : 220,
    backgroundColor: "#A9A9A9",
    paddingVertical: 12,
    alignItems: 'center',
    margin: 20,
    borderRadius: 8,
    bottom: 20,
 
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
