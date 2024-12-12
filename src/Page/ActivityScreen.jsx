import React, { useState, useCallback, memo, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, InteractionManager } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getOnlineBills, getAllCustomers, getAllPriceProduct } from '../untills/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../untills/context/AuthContext';

const calculateOriginalTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.currentPrice || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);
};

const RenderItem = memo(({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.activityItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <View style={styles.itemContent}>
        {item.items.map((productItem, index) => (
          <View key={productItem.id || index} style={styles.productItem}>
            <Image source={{ uri: productItem.image || '' }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.title}>
                {productItem.title} 
                {productItem.totalPrice === 0 && <Text style={styles.promotionalText}> (Quà tặng)</Text>}
              </Text>
              <Text style={styles.price}>
                {productItem.totalPrice > 0
                  ? `${productItem.totalPrice.toLocaleString('vi-VN')}đ`
                  : 'Miễn phí'}
              </Text>
              <Text style={styles.quantity}>{productItem.quantity} {productItem.unit}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.statusButtonContainer}>
        <Text 
          style={[
            styles.orderStatus, 
            item.status === 'Hoàn thành' ? styles.completedStatus : 
            item.status === 'Hoàn trả' ? styles.refundedStatus : 
            item.status === 'Từ chối' ? styles.refundedStatus : 
            item.status === 'Kiểm hàng' ? styles.processingStatus : 
            item.status === 'Đang xử lý' ? styles.processingStatus : null
          ]}
        >
          {item.status}
        </Text>
      </View>

      <View style={styles.priceContainer}>
        {calculateOriginalTotal(item.items) !== item.totalPrice ? (
          <>
            <Text style={styles.discountedTotalText}>
              {item.totalPrice.toLocaleString('vi-VN')}đ
            </Text>
            <Text style={styles.originalTotalText}>
              {calculateOriginalTotal(item.items).toLocaleString('vi-VN')}đ
            </Text>
          </>
        ) : (
          <Text style={styles.discountedTotalText}>
            {item.totalPrice.toLocaleString('vi-VN')}đ
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

export default function ActivityScreen(route) {
  const { user } = useContext(AuthContext);
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('Tất cả');
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [products, setProducts] = useState([]);
console.log(bills);

  const fetchCustomer = useCallback(async () => {
    try {
      const customers = await getAllCustomers();
      const currentCustomer = customers.find(cust => cust.CustomerId === user._id);
      if (currentCustomer) {
        setCustomer(currentCustomer);
      } else {
        Alert.alert("Thông báo", "Không tìm thấy thông tin khách hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khách hàng:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin khách hàng.");
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllPriceProduct();
        if (productsData.success) {
          setProducts(productsData.prices || []);
        } else {
          console.error("Failed to fetch products:", productsData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchBills = useCallback(async () => {
    if (!customer?._id) return;
    setLoading(true);
    try {
      const [response, productsResponse] = await Promise.all([getOnlineBills(), getAllPriceProduct()]);
      
      const productsMap = new Map(productsResponse.prices.map(product => [product.productId.toString(), product.image]));
      
      const customerBills = response.filter(bill => bill.customer._id === customer._id);
      const sortedBills = customerBills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const formattedBills = sortedBills.map(bill => ({
        id: bill._id,
        customer: bill.customer,
        billCode: bill.billCode,
        paymentMethod: bill.paymentMethod,
        time: new Date(bill.createdAt).toLocaleString('vi-VN'),
        status: 
          bill.status === 'HoanThanh' ? 'Hoàn thành' : 
          bill.status === 'HoanTra' ? 'Hoàn trả' : 
          bill.status === 'Canceled' ? 'Từ chối' : 
          bill.status === 'KiemHang' ? 'Kiểm hàng' : // Đã thêm trạng thái "Kiểm hàng"
          'Đang xử lý',
        totalPrice: bill.totalAmount,
        items: [
          ...bill.items.map(productItem => ({
            currentPrice: productItem.currentPrice,
            id: productItem._id,
            title: productItem.product.name || 'Không có tên sản phẩm',
            quantity: productItem.quantity,
            unit: productItem.unit,
            totalPrice: productItem.totalPrice || (productItem.currentPrice * productItem.quantity) || 0,
            image: productItem.product.image || 'https://via.placeholder.com/50',
          })),
          ...bill.giftItems.map(giftItem => ({
            id: giftItem._id,
            title: `🎁 ${giftItem.product.name || 'Sản phẩm khuyến mãi'}`,
            quantity: giftItem.quantity,
            unit: giftItem.unit,
            totalPrice: 0,
            image: productsMap.get(giftItem.product.toString()) || 'https://via.placeholder.com/50',
          })),
        ],
      }));

      setBills(formattedBills);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setBills([]);
      } else {
        console.error("Lỗi khi lấy hóa đơn:", error);
        Alert.alert('Lỗi', 'Không thể tải hóa đơn.');
      }
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async () => {
        await fetchCustomer();
      });
      return () => task.cancel();
    }, [fetchCustomer])
  );

  useEffect(() => {
    if (customer) {
      fetchBills();
    }
  }, [customer]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBills();
    setRefreshing(false);
  };

  if (loading) {
    return <ActivityIndicator size={50} color="#ff9800" style={styles.loadingIndicator} />;
  }

  const filteredBills = bills.filter(bill => {
    if (filter === 'Tất cả') return true;
    if (filter === 'Hoàn thành') return bill.status === 'Hoàn thành';
    if (filter === 'Hoàn trả') return bill.status === 'Hoàn trả';
    if (filter === 'Đang xử lý') return ['Đang xử lý', 'Kiểm hàng'].includes(bill.status);
    if (filter === 'Kiểm hàng') return bill.status === 'Kiểm hàng';
    if (filter === 'Từ chối') return bill.status === 'Từ chối';
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={{ left: -20, top: 23 }}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hoạt động</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={filter === 'Tất cả' ? styles.filterButtonActive : styles.filterButton}
          onPress={() => setFilter('Tất cả')}
        >
          <Text style={filter === 'Tất cả' ? styles.filterTextActive : styles.filterText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={filter === 'Hoàn thành' ? styles.filterButtonActive : styles.filterButton}
          onPress={() => setFilter('Hoàn thành')}
        >
          <Text style={filter === 'Hoàn thành' ? styles.filterTextActive : styles.filterText}>Hoàn thành</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={filter === 'Hoàn trả' ? styles.filterButtonActive : styles.filterButton}
          onPress={() => setFilter('Hoàn trả')}
        >
          <Text style={filter === 'Hoàn trả' ? styles.filterTextActive : styles.filterText}>Hoàn trả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={['Đang xử lý', 'Kiểm hàng'].includes(filter) ? styles.filterButtonActive : styles.filterButton}
          onPress={() => setFilter('Đang xử lý')}
        >
          <Text style={['Đang xử lý', 'Kiểm hàng'].includes(filter) ? styles.filterTextActive : styles.filterText}>
            Đang xử lý
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={filter === 'Kiểm hàng' ? styles.filterButtonActive : styles.filterButton}
          onPress={() => setFilter('Kiểm hàng')}
        >
          <Text style={filter === 'Kiểm hàng' ? styles.filterTextActive : styles.filterText}>Kiểm hàng</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={filter === 'Từ chối' ? styles.filterButtonActive : styles.filterButton}
          onPress={() => setFilter('Từ chối')}
        >
          <Text style={filter === 'Từ chối' ? styles.filterTextActive : styles.filterText}>Từ chối</Text>
        </TouchableOpacity>
      </View>

      {filteredBills.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={filteredBills}
            renderItem={({ item }) => <RenderItem item={item} onPress={(selectedBill) => navigation.navigate('OrderDetailScreen', { bill: selectedBill })} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20, flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 40,
    backgroundColor: '#ffcc00',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  filterButtonActive: {
    backgroundColor: '#fff7e6',
    padding: 10,
    borderRadius: 20,
    marginRight: 5,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 5,
  },
  filterTextActive: {
    color: '#ff9800',
  },
  filterText: {
    color: '#888',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  activityItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'column',
    position: 'relative',
    minHeight: 100,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  time: {
    color: '#888',
  },
  itemContent: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  title: {
    fontWeight: 'bold',
  },
  price: {
    color: '#ff9800',
    marginTop: 5,
  },
  quantity: {
    color: '#888',
    marginTop: 5,
  },
  statusButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 50,
    alignItems: 'center',
  },
  orderStatus: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  completedStatus: {
    color: '#4caf50',
  },
  refundedStatus: {
    color: '#ff5722',
  },
  processingStatus: {
    color: '#FFA500',
  },
  reorderButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#ffcc00',
    borderRadius: 5,
  },
  reorderText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  priceContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  originalTotalText: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  discountedTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
