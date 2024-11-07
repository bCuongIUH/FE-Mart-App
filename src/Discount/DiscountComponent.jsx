import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getAllActiveVouchers } from '../untills/api';

export default function DiscountComponent({ navigation, route }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nhấn chọn discount
  const handleSelectDiscount = (discount) => {
    route.params.onSelectDiscount(discount);
    navigation.goBack();
  };

  // Lấy danh sách khuyến mãi
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

  // ko có khuyến mãi 
  const EmptyVoucherMessage = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="gift" size={50} color="#ccc" />
      <Text style={styles.emptyText}>Hiện tại không có khuyến mãi nào!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ left: -20, top: 10 }}>
          <MaterialIcons name="close" size={24} color="black" />
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
          renderItem={({ item }) => {
            const formattedConditions = item.conditions
              ? item.conditions.map((cond) => {
                  if (cond.minOrderValue && cond.discountPercentage) {
                    return `Giảm ${cond.discountPercentage}% cho đơn tối thiểu ${cond.minOrderValue.toLocaleString('vi-VN')}đ, tối đa ${cond.maxDiscountAmount?.toLocaleString('vi-VN') || 'không giới hạn'}đ`;
                  } else if (cond.minOrderValue && cond.discountAmount) {
                    return `Giảm ${cond.discountAmount.toLocaleString('vi-VN')}đ cho đơn tối thiểu ${cond.minOrderValue.toLocaleString('vi-VN')}đ`;
                  } else {
                    return 'Điều kiện không xác định';
                  }
                }).join('\n')
              : 'Không có điều kiện';

            return (
              <TouchableOpacity
                style={styles.discountItem}
                onPress={() => handleSelectDiscount(item.label || item.code)}
              >
                <View style={styles.discountInfo}>
                  <Text style={styles.discountText}>{item.label || item.code}</Text>
                  <Text style={styles.discountCondition}>{formattedConditions}</Text>
                </View>
                <MaterialIcons name="check-box-outline-blank" size={24} color="gray" />
              </TouchableOpacity>
            );
          }}
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
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 10,
  },
  discountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  discountInfo: {
    flexDirection: 'column',
  },
  discountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountCondition: {
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
});

