import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../untills/context/AuthContext';
import { getAllCustomers, getOnlineBills } from '../untills/api';

export default function SpendingScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('week'); 
  const screenWidth = Dimensions.get('window').width;

  // Hàm lấy thông tin khách hàng dựa trên user._id (CustomerId)
  const fetchCustomer = async () => {
    try {
      const customerData = await getAllCustomers();
      // Tìm `customer` có `CustomerId` khớp với `user._id`
      const currentCustomer = customerData.find(cust => cust.CustomerId === user._id);
      if (currentCustomer) {
        setCustomer(currentCustomer); // Đặt customer với `_id` đúng
        console.log("Customer found:", currentCustomer); // Log để kiểm tra thông tin customer
      } else {
        Alert.alert("Không tìm thấy khách hàng", "Thông tin khách hàng chưa có trong hệ thống.");
      }
    } catch (err) {
      console.error("Error fetching customer data:", err);
      setError("Không thể tải dữ liệu khách hàng.");
    }
  };

  // Hàm lấy danh sách hóa đơn dựa trên customer._id
  const fetchBills = async () => {
    if (!customer?._id) return;
    try {
      const allBills = await getOnlineBills();
 
      const customerBills = allBills.filter(bill => bill.customer && bill.customer._id.toString() === customer._id.toString());
  
      setBills(customerBills);
    } catch (err) {
      console.error("Error fetching bills data:", err);
      setError("Không thể tải dữ liệu hóa đơn.");
    }
  };
  
  
  

  useEffect(() => {
   
    const fetchData = async () => {
      setLoading(true);
      await fetchCustomer();
      setLoading(false);
    };

   
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, user]);

  // Khi đã có thông tin khách hàng, gọi fetchBills để lấy hóa đơn
  useEffect(() => {
    if (customer?._id) {
      fetchBills(); 
    }
  }, [customer]);


  // Hàm xử lý dữ liệu cho biểu đồ
  const processData = (data, isWeekly) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    return data.reduce((acc, bill) => {
      const billDate = new Date(bill.createdAt);
      const timeDiff = now - billDate;
      
      if (isWeekly) {
        const dayIndex = Math.floor(timeDiff / oneDay);
        if (dayIndex < 7) {
          acc[dayIndex] = (acc[dayIndex] || 0) + bill.totalAmount;
        }
      } else {
        const weekIndex = Math.floor(timeDiff / oneWeek);
        if (weekIndex < 4) {
          acc[weekIndex] = (acc[weekIndex] || 0) + bill.totalAmount;
        }
      }
      
      return acc;
    }, new Array(isWeekly ? 7 : 4).fill(0));
  };

  const getDayLabels = () => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const today = new Date().getDay();
    return days.slice(today + 1).concat(days.slice(0, today + 1)).reverse();
  };

  const getWeekLabels = () => {
    return ['Tuần này', 'Tuần trước', '2 tuần trước', '3 tuần trước'];
  };

  const weeklyData = {
    labels: getDayLabels(),
    datasets: [
      {
        data: processData(bills, true),
        color: () => '#FFD700',
      },
    ],
  };

  const monthlyData = {
    labels: getWeekLabels(),
    datasets: [
      {
        data: processData(bills, false),
        color: () => '#FFD700',
      },
    ],
  };

  const currentData = timeFrame === 'week' ? weeklyData : monthlyData;
  const totalSpending = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalDiscount = bills.reduce((sum, bill) => sum + (bill.discountAmount || 0), 0);
  const orderCount = bills.length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffcc00" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Quay lại">
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý chi tiêu</Text>
        <Text style={styles.userName}>{customer ? customer.fullName : 'Khách hàng'}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.spendingInfo}>
          <Text style={styles.spendingAmount}>{totalSpending.toLocaleString('vi-VN')}đ</Text>
          <Text style={styles.orderCount}>({orderCount} đơn hàng)</Text>
          <Text style={styles.discountText}>Tiết kiệm được {totalDiscount.toLocaleString('vi-VN')}đ nhờ ưu đãi</Text>
        </View>

        <BarChart
          data={currentData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix="đ"
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForLabels: {
              fontSize: 10,
            },
          }}
          style={styles.chart}
          showValuesOnTopOfBars={true}
          fromZero={true}
        />
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 70,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffcc00',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 10,
    flex: 1,
  },
  userName: { 
    fontSize: 14, 
    color: '#333', 
  },
  timeSelection: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 15 
  },
  timeButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 30, 
    borderRadius: 20, 
    backgroundColor: '#EEE',
    marginHorizontal: 5,
  },
  activeTimeButton: { 
    backgroundColor: '#FFD700' 
  },
  timeButtonText: { 
    fontSize: 14, 
    color: '#333' 
  },
  spendingInfo: { 
    alignItems: 'center', 
    marginVertical: 20 
  },
  spendingAmount: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  orderCount: { 
    fontSize: 16, 
    color: '#333', 
    marginTop: 5,
  },
  discountText: { 
    fontSize: 14, 
    color: '#4CAF50', 
    marginTop: 10 
  },
  chart: { 
    marginVertical: 20, 
    borderRadius: 8,
    marginHorizontal: 20,
  },
  bePointSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: '#EEE',
    marginTop: 20,
  },
  bePointText: { 
    fontSize: 16, 
    color: '#333' 
  },
  bePointValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FFD700' 
  },
  updateInfo: { 
    fontSize: 12, 
    color: '#888', 
    textAlign: 'center', 
    marginVertical: 15 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});