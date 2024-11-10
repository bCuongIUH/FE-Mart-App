import React, { useState, useCallback, memo, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getOnlineBills } from '../untills/api'; 
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const RenderItem = memo(({ item }) => (
  <View style={styles.activityItem}>
    <View style={styles.itemHeader}>
      <Text style={styles.time}>{item.time}</Text>
    </View>

    <View style={styles.itemContent}>
      {item.items.map((productItem, index) => (
        <View key={productItem.id || index} style={styles.productItem}>
          <Image source={{ uri: productItem.image || '' }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.title}>{productItem.title || 'Không có tên sản phẩm'}</Text>
            <Text style={styles.price}>{`${productItem.totalPrice.toLocaleString('vi-VN')}đ`}</Text>
            <Text style={styles.quantity}>{productItem.quantity} {productItem.unit}</Text>
          </View>
        </View>
      ))}
    </View>

    <View style={styles.statusButtonContainer}>
      <Text style={[styles.orderStatus, item.status === 'Hoàn thành' ? styles.completedStatus : styles.refundedStatus]}>
        {item.status}
      </Text>
      <TouchableOpacity style={styles.reorderButton} onPress={() => Alert.alert('Đặt lại', `Bạn muốn đặt lại hóa đơn với mã `)}>
        <Text style={styles.reorderText}>Đặt lại</Text>
      </TouchableOpacity>
    </View>
  </View>
));

export default function ActivityScreen() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('Tất cả');
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOnlineBills();
      const sortedResponse = response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const formattedBills = sortedResponse.map(bill => ({
        id: bill._id,
        time: new Date(bill.createdAt).toLocaleString('vi-VN'),
        status: bill.status === 'HoanThanh' ? 'Hoàn thành' : 'Đang xử lý',
        items: bill.items.map(productItem => ({
          id: productItem._id,
          title: productItem.product.name || 'Không có tên sản phẩm',
          quantity: productItem.quantity,
          unit: productItem.unit,
          totalPrice: productItem.totalPrice,
          image: productItem.product.image || null,
        })),
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBills();
    }, [fetchBills])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBills();
    setRefreshing(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ff9800" style={styles.loadingIndicator} />;
  }

  // Lọc các hóa đơn dựa trên trạng thái đã chọn
  const filteredBills = bills.filter(bill => {
    if (filter === 'Tất cả') return true;  
    if (filter === 'Hoàn thành') return bill.status === 'Hoàn thành';
    if (filter === 'Hoàn trả') return bill.status === 'Hoàn trả';
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ left: -20, top: 23 }}>
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
            data={filteredBills}  // Áp dụng dữ liệu đã lọc vào FlatList
            renderItem={({ item }) => <RenderItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20, flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            initialNumToRender={5} 
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews
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
});
