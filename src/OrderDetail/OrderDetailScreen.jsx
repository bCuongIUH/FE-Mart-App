import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../untills/context/AuthContext';
import { deleteBill, getAllCustomers } from '../untills/api';

export default function OrderDetailScreen({ route, navigation }) {
    const [bill, setBill] = useState(route.params.bill);
  const { user } = useContext(AuthContext); 
  const [customer, setCustomer] = useState(null);

  const fetchCustomer = async () => {
    if (!user) return;
    try {
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
// console.log(bill);

  useFocusEffect(
    useCallback(() => {
      fetchCustomer();
    }, [user])
  );
  useFocusEffect(
    useCallback(() => {
      if (route.params?.updatedBill) {
        setBill(route.params.updatedBill); 
      }
    }, [route.params])
  );
  
  
  const handleDeleteBill = async (billId) => {
    try {
      await deleteBill(billId); // Gọi API xóa hóa đơn
      navigation.navigate('ActivityScreen', { refresh: true });
    } catch (error) {
      // Không làm gì khi xảy ra lỗi
      navigation.navigate('ActivityScreen', { refresh: true });
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <TouchableOpacity
            onPress={() =>
                Alert.alert(
                'Xóa đơn hàng',
                'Bạn có chắc chắn muốn xóa?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => handleDeleteBill(bill.id), 
                    },
                ],
                { cancelable: true }
                )
            }
            >
            <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>


      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        {/* Trạng thái đơn hàng */}
        <View style={styles.statusContainer}>
          {bill.status === 'Hoàn thành' && (
            <>
              <Text style={styles.statusTitle}>Đơn hàng của bạn đã hoàn tất</Text>
              <Text style={styles.statusMessage}>Chúc bạn một ngày tốt lành!</Text>
              <View style={styles.statusIconContainer}>
                <MaterialIcons name="check-circle" size={50} color="#4caf50" />
              </View>
            </>
          )}
          {bill.status === 'Đang xử lý' && (
            <>
              <Text style={styles.statusTitle}>Đơn hàng của bạn đang xử lý</Text>
              <Text style={styles.statusMessage}>Chúng tôi sẽ cập nhật sớm nhất có thể!</Text>
              <View style={styles.statusIconContainer}>
                <MaterialIcons name="hourglass-empty" size={50} color="#ffc107" />
              </View>
            </>
          )}
             {bill.status === 'Kiểm hàng' && (
            <>
              <Text style={styles.statusTitle}>Đơn hàng của bạn đã được tiếp nhận hoàn trả</Text>
              <Text style={styles.statusMessage}>Chúng tôi sẽ tiếp nhận và kiểm tra đơn hàng của bạn!</Text>
              <View style={styles.statusIconContainer}>
                <MaterialIcons name="hourglass-empty" size={50} color="#ffc107" />
              </View>
            </>
          )}
          {bill.status === 'Từ chối' && (
            <>
              <Text style={styles.statusTitle}>Đơn hàng của bạn đã từ chối hoàn trả</Text>
              <Text style={styles.statusMessage}>Xin lỗi vì sự bất tiện này!</Text>
              <View style={styles.statusIconContainer}>
                <MaterialIcons name="error" size={50} color="#FF4C4C" />
              </View>
            </>
          )}
                {bill.status === 'Hoàn trả' && (
            <>
              <Text style={styles.statusTitle}>Đơn hàng của bạn đã hoàn trả</Text>
              <Text style={styles.statusMessage}>Xin lỗi vì sự bất tiện này!</Text>
              <View style={styles.statusIconContainer}>
                <MaterialIcons name="check-circle" size={50} color="#FF8C00" />
              </View>
            </>
          )}
        </View>

        {/* Danh sách sản phẩm */}
        <View style={styles.orderItems}>
          <Text style={styles.storeName}>Danh sách sản phẩm</Text>
          {bill.items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Image
                source={{ uri: item.image || 'https://via.placeholder.com/50' }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemOptions}>{item.unit || ''} ({item.quantity})</Text>
                <Text style={styles.itemOptions}>{item.currentPrice ? `${item.currentPrice.toLocaleString('vi-VN')} đ` : ''}</Text>
              </View>
              <Text style={styles.itemPrice}>{item.totalPrice.toLocaleString('vi-VN')}đ</Text>
            </View>
          ))}
        </View>

        {/* Chi tiết thanh toán */}
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>Chi tiết thanh toán</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Trả qua {bill.paymentMethod}</Text>
            <Text style={styles.paymentValue}>{bill.totalPrice.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {/* Thông tin đơn hàng */}
        <View style={styles.orderInfo}>
          <Text style={styles.orderCode}>Mã đơn: {bill.billCode}</Text>
          <Text style={styles.orderDate}>Ngày đặt: {bill.time}</Text>
          <View style={styles.storeInfo}>
            <Text style={styles.storeAddress}>Siêu Thị C'Mart</Text>
            <Text style={styles.storeAddressDetails}>
              12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP.HCM
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="arrow-down" size={24} color="black" />
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeAddress}>Địa chỉ nhận hàng</Text>
            <Text style={styles.storeAddressDetails}>
              {`${customer?.addressLines?.houseNumber}, Phường ${customer?.addressLines?.ward}, Quận ${customer?.addressLines?.district}, ${customer?.addressLines?.province}`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      {bill.status === 'Hoàn thành' && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.reorderButton} 
            onPress={() => navigation.navigate('ReturnRequestScreen', { bill })}
            >
            <Text style={styles.reorderButtonText}>Yêu cầu hoàn trả</Text>
            </TouchableOpacity>

        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 45,
    backgroundColor: '#ffcc00',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    padding: 5,
    top: 10,
    left: -20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    top: 10,
    left: -20,
    // textAlign: 'center',
  },
  deleteText: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontSize: 16,
    top: 10,
  },
  scrollContent: {
    flex: 1,
    marginTop: 70, // Adjust based on your header height
    marginBottom: 70, // Adjust based on your footer height
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  statusIconContainer: {
    marginTop: 10,
  },
  orderItems: {
    marginBottom: 20,
    padding: 20,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemOptions: {
    fontSize: 12,
    color: '#888',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  paymentInfo: {
    marginBottom: 20,
    marginHorizontal: 15,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  paymentLabel: {
    fontSize: 14,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderInfo: {
    marginBottom: 20,
    marginHorizontal: 15,
  },
  orderCode: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 10,
  },
  storeInfo: {
    marginBottom: 10,
  },
  storeAddress: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  storeAddressDetails: {
    fontSize: 12,
    color: '#888',
  },
  iconContainer: {
    // alignItems: 'center',
    marginVertical: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  reorderButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});