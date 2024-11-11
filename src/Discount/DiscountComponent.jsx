import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getAllActiveVouchers } from '../untills/api';

export default function DiscountComponent({ navigation, route }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { totalAmount, onSelectDiscount } = route.params;

  const handleSelectDiscount = (discount) => {
    const minOrderValue = discount.conditions?.minOrderValue || 0;
    const isEligible = totalAmount >= minOrderValue;

    if (isEligible) {
      onSelectDiscount(discount);
      navigation.goBack();
    } else {
      Alert.alert("Thông báo", "Tổng số tiền không đạt điều kiện tối thiểu cho mã khuyến mãi này.");
    }
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await getAllActiveVouchers();

        // Sắp xếp các voucher, những voucher đủ điều kiện lên đầu danh sách
        const sortedVouchers = response.sort((a, b) => {
          const aEligible = totalAmount >= (a.conditions?.minOrderValue || 0);
          const bEligible = totalAmount >= (b.conditions?.minOrderValue || 0);
          return bEligible - aEligible;
        });

        setVouchers(sortedVouchers);
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
            const minOrderValue = item.conditions?.minOrderValue || 0;
            const isEligible = totalAmount >= minOrderValue;

            // Xử lý điều kiện giảm giá dựa trên loại voucher
            const formattedConditions = item.type === 'FixedDiscount'
              ? `Giảm ${item.conditions.discountAmount?.toLocaleString('vi-VN')}đ cho đơn tối thiểu ${item.conditions.minOrderValue?.toLocaleString('vi-VN')}đ`
              : item.type === 'PercentageDiscount'
              ? `Giảm ${item.conditions.discountPercentage}% tối đa ${item.conditions.maxDiscountAmount?.toLocaleString('vi-VN') || 'không giới hạn'}đ cho đơn tối thiểu ${item.conditions.minOrderValue?.toLocaleString('vi-VN')}đ`
              : item.type === 'BuyXGetY'
              ? `Mua ${item.conditions.quantityX} ${item.conditions.unitXName} ${item.conditions.productXName} để nhận ${item.conditions.quantityY} ${item.conditions.unitYName} ${item.conditions.productYName}`
              : 'Không có điều kiện';

            return (
              <TouchableOpacity
                style={[styles.discountItem, !isEligible && styles.ineligibleDiscount]}
                onPress={() => isEligible && handleSelectDiscount(item)}
                disabled={!isEligible}
              >
                <View style={styles.discountInfo}>
                  <Text style={styles.discountText}>{item.label || item.code}</Text>
                  <Text style={styles.discountCondition}>{formattedConditions}</Text>
                </View>
                {isEligible ? (
                  <MaterialIcons name="check-box-outline-blank" size={24} color="gray" />
                ) : null}
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
  ineligibleDiscount: {
    opacity: 0.5,
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
