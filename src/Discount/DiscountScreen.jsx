import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getAllActiveVouchers } from '../untills/api';

export default function DiscountScreen({ navigation }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await getAllActiveVouchers();
        setVouchers(response);
      } catch (error) {
        console.error("Error fetching vouchers:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const EmptyVoucherMessage = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="gift" size={50} color="#ccc" />
      <Text style={styles.emptyText}>Hiện tại không có khuyến mãi nào!</Text>
    </View>
  );

  const renderVoucherItem = ({ item }) => {
    const formattedConditions = item.type === 'FixedDiscount'
      ? `Giảm ${item.conditions.discountAmount?.toLocaleString('vi-VN')}đ cho đơn tối thiểu ${item.conditions.minOrderValue?.toLocaleString('vi-VN')}đ`
      : item.type === 'PercentageDiscount'
      ? `Giảm ${item.conditions.discountPercentage}% tối đa ${item.conditions.maxDiscountAmount?.toLocaleString('vi-VN') || 'không giới hạn'}đ cho đơn tối thiểu ${item.conditions.minOrderValue?.toLocaleString('vi-VN')}đ`
      : item.type === 'BuyXGetY'
      ? `Mua ${item.conditions.quantityX} ${item.conditions.unitXName} ${item.conditions.productXName} để nhận ${item.conditions.quantityY} ${item.conditions.unitYName} ${item.conditions.productYName}`
      : 'Không có điều kiện';

    return (
      <View style={styles.voucherItem}>
        <View style={styles.voucherInfo}>
          <Text style={styles.voucherText}>{item.label || item.code}</Text>
          <Text style={styles.voucherCondition}>{formattedConditions}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khuyến mãi</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6600" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={vouchers}
          keyExtractor={(item) => item._id || item.id.toString()}
          ListEmptyComponent={EmptyVoucherMessage}
          renderItem={renderVoucherItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffcc00',
  },
  goBackButton: {
    position: 'absolute',
    left: 10,
  top: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // textAlign: 'center',
    flex: 1,
    paddingTop: 10,
  },
  voucherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  voucherInfo: {
    flexDirection: 'column',
  },
  voucherText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  voucherCondition: {
    fontSize: 14,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
  },
  listContent: {
    paddingHorizontal: 10,
  },
});
