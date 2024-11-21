import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getAllActiveVouchers } from '../untills/api';

export default function DiscountComponent({ navigation, route }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { totalAmount, onSelectDiscount, selectedProducts = [] } = route.params;

  // Handle voucher selection
  const handleSelectDiscount = (discount) => {
    if (!discount.conditions) {
      Alert.alert("Lỗi", "Điều kiện của voucher không hợp lệ.");
      return;
    }
  
    if (discount.type === 'BuyXGetY') {
      const { productXId, unitX, quantityX } = discount.conditions;
      const eligibleProduct = selectedProducts.find(item => 
        item.product._id === productXId &&
        item.unit === unitX && 
        item.quantity >= quantityX
      );
  
      if (eligibleProduct) {
        onSelectDiscount(discount);
        navigation.goBack();
      } else {
        Alert.alert("Thông báo", "Bạn chưa đủ điều kiện để áp dụng khuyến mãi này.");
      }
    } else {
      const minOrderValue = discount.conditions?.minOrderValue || 0;
      const isEligible = totalAmount >= minOrderValue;
  
      if (isEligible) {
        onSelectDiscount(discount);
        navigation.goBack();
      } else {
        Alert.alert("Thông báo", "Tổng số tiền không đạt điều kiện tối thiểu cho mã khuyến mãi này.");
      }
    }
  };
  

  // Fetch and sort vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await getAllActiveVouchers();
        if (!response || !Array.isArray(response)) {
          setVouchers([]);
          return;
        }
  
        // Filter and sort vouchers safely
        const sortedVouchers = response
          .filter((voucher) => voucher.conditions) // Ensure conditions exist
          .sort((a, b) => {
            if (a.type === 'BuyXGetY' && b.type === 'BuyXGetY') {
              const aEligible = selectedProducts.some(item => 
                item.product._id === a.conditions?.productXId && item.quantity >= (a.conditions?.quantityX || 0)
              );
              const bEligible = selectedProducts.some(item => 
                item.product._id === b.conditions?.productXId && item.quantity >= (b.conditions?.quantityX || 0)
              );
              return bEligible - aEligible;
            } else if (a.type === 'BuyXGetY') {
              return -1;
            } else if (b.type === 'BuyXGetY') {
              return 1;
            } else {
              const aEligible = totalAmount >= (a.conditions?.minOrderValue || 0);
              const bEligible = totalAmount >= (b.conditions?.minOrderValue || 0);
              return bEligible - aEligible;
            }
          });
  
        setVouchers(sortedVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error.message);
        Alert.alert("Lỗi", "Không thể tải danh sách khuyến mãi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchVouchers();
  }, [totalAmount, selectedProducts]);
  

  // Render empty message for vouchers
  const EmptyVoucherMessage = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="gift" size={50} color="#ccc" />
      <Text style={styles.emptyText}>Hiện tại không có khuyến mãi nào!</Text>
    </View>
  );

  // Check eligibility for discounts
  const isEligibleForDiscount = (item) => {
    if (item.type === 'BuyXGetY') {
      return selectedProducts.some(product => 
        product.product._id === item.conditions?.productXId &&
        product.unit === item.conditions?.unitX &&
        product.quantity >= (item.conditions?.quantityX || 0)
      );
    } else {
      const minOrderValue = item.conditions?.minOrderValue || 0;
      return totalAmount >= minOrderValue;
    }
  };
  

  // Format conditions for display
  const getFormattedConditions = (item) => {
    if (item.type === 'BuyXGetY') {
      return `Mua ${item.conditions.quantityX} ${item.conditions.unitX || 'sản phẩm'} ${item.conditions.productXName} để nhận ${item.conditions.quantityY} ${item.conditions.unitY || 'sản phẩm'} ${item.conditions.productYName}`;
    } else if (item.type === 'FixedDiscount') {
      return `Giảm ${item.conditions.discountAmount?.toLocaleString('vi-VN')}đ cho đơn tối thiểu ${item.conditions.minOrderValue?.toLocaleString('vi-VN')}đ`;
    } else if (item.type === 'PercentageDiscount') {
      return `Giảm ${item.conditions.discountPercentage}% tối đa ${item.conditions.maxDiscountAmount?.toLocaleString('vi-VN') || 'không giới hạn'}đ cho đơn tối thiểu ${item.conditions.minOrderValue?.toLocaleString('vi-VN')}đ`;
    } else {
      return 'Không có điều kiện';
    }
  };
  

  // Render UI
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ left: -20, top: 10 }}>
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khuyến mãi</Text>
      </View>

      {loading ? (
        <ActivityIndicator size={50} color="#ff6600" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
        data={vouchers}
        keyExtractor={(item) => item._id || item.id.toString()}
        ListEmptyComponent={EmptyVoucherMessage}
        renderItem={({ item }) => {
          const isEligible = isEligibleForDiscount(item);
          const formattedConditions = getFormattedConditions(item);
      
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
