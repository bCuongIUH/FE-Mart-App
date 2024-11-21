
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { createBill, getAllCustomers, getAllPriceProduct } from '../untills/api';
import { AuthContext } from '../untills/context/AuthContext';

export default function CheckoutScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedProducts } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('Chọn phương thức thanh toán');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [promotionalItems, setPromotionalItems] = useState([]);
  const [products, setProducts] = useState([]);

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

  useFocusEffect(
    useCallback(() => {
      fetchCustomer();
    }, [user])
  );

  // Tính tổng tiền
  const totalAmount = selectedProducts.reduce((sum, item) => {
    return sum + (item.currentPrice * item.quantity || 0);
  }, 0);

  // Tính tổng tiền sau khi giảm giá
  const calculateDiscountedTotal = () => {
    if (!appliedDiscount || !appliedDiscount.conditions) return totalAmount;
  
    const condition = appliedDiscount.conditions;
    
    if (appliedDiscount.type === "BuyXGetY") {
      // BuyXGetY logic is handled separately, no direct discount on total
      return totalAmount;
    } else if (condition.discountAmount) {
      return totalAmount - condition.discountAmount;
    } else if (condition.discountPercentage) {
      const discount = (totalAmount * condition.discountPercentage) / 100;
      const maxDiscount = condition.maxDiscountAmount || discount;
      return totalAmount - Math.min(discount, maxDiscount);
    }
    
    return totalAmount;
  };

  const discountedTotal = calculateDiscountedTotal();

  const handleSelectDiscount = (discount) => {
    if (!discount) {
      setAppliedDiscount(null);
      setPromotionalItems([]);
      return;
    }
  
    setAppliedDiscount(discount);
    if (discount.type === "BuyXGetY") {
      applyBuyXGetYDiscount(discount);
    } else {
      setPromotionalItems([]);
    }
  };
  
  const applyBuyXGetYDiscount = (discount) => {
    const { productXId, quantityX, productYId, quantityY } = discount.conditions;
  
    const eligibleItem = selectedProducts.find(item => item.product._id === productXId);
  
    if (eligibleItem && eligibleItem.quantity >= quantityX) {
      const freeItemsCount = Math.floor(eligibleItem.quantity / quantityX) * quantityY;
  
      // Tìm sản phẩm Y từ danh sách sản phẩm (products) đã tải từ API
      const productYData = products.find(product => product.productId === productYId);
  
      const promotionalItem = {
        product: {
          _id: productYId,
          name: productYData ? productYData.productName : discount.conditions.productYName, // Lấy tên sản phẩm từ dữ liệu API nếu có
          image: productYData ? productYData.image : discount.conditions.productYImage || '', // Lấy hình ảnh từ dữ liệu API nếu có
        },
        quantity: freeItemsCount,
        unit: discount.conditions.unitY, // Đơn vị của sản phẩm tặng
        currentPrice: 0, // Giá 0 cho hàng khuyến mãi
        isPromotional: true, // Đánh dấu là khuyến mãi
      };
  
      setPromotionalItems([promotionalItem]);
    } else {
      setPromotionalItems([]); // Xóa quà tặng nếu không đủ điều kiện
    }
  };
  


  const renderProductItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.product.image || 'https://via.placeholder.com/60' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.product.name}</Text>
        <Text style={styles.itemQuantity}>
          x{item.quantity} - {item.unit}
        </Text>
        {item.isPromotional && <Text style={styles.promotionalText}>Khuyến mãi</Text>}
      </View>
      <Text style={styles.itemPrice}>
        {item.currentPrice > 0
          ? `${(item.currentPrice * item.quantity).toLocaleString('vi-VN')}đ`
          : 'Miễn phí'}
      </Text>
    </View>
  );
  

  

  const handleOrder = async () => {
    if (!paymentMethod || paymentMethod === "Chọn phương thức thanh toán") {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán.");
      return;
    }
  
    if (!customer || !customer._id) {
      Alert.alert("Thông báo", "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.");
      return;
    }
  
    const finalTotal = discountedTotal;
    const itemIds = [...selectedProducts, ...promotionalItems].map(item => item._id).filter(Boolean);
  
    if (itemIds.length === 0) {
      Alert.alert("Thông báo", "Không có sản phẩm nào trong giỏ hàng.");
      return;
    }
  
    const billData = {
      customerId: customer._id,
      paymentMethod: paymentMethod === "Tiền mặt" ? "Cash" : paymentMethod,
      itemIds,
      voucherCodes: appliedDiscount ? [appliedDiscount.code] : [], // Gửi voucherCode trong mảng []
    };
  
    console.log("Bill Data:", billData);
  
    try {
      const response = await createBill(billData);
      if (response && response.bill) {
        console.log("Bill created:", response.bill);
        Alert.alert("Thành công", "Hóa đơn của bạn đã được tạo thành công!");
        navigation.navigate('ActivityScreen', { bill: response.bill });
      } else {
        throw new Error("Không nhận được thông tin hóa đơn từ server.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo hóa đơn. Vui lòng thử lại.");
    }
  };
  
  
  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.addressContainer}>
          <MaterialIcons name="location-on" size={24} color="gray" />
          <View style={styles.addressDetails}>
            {customer && customer.addressLines ? (
              <>
                <Text style={styles.address}>{customer.addressLines.houseNumber}</Text>
                <Text style={styles.subAddress}>
                  P.{customer.addressLines.ward}, Q.{customer.addressLines.district}, {customer.addressLines.province}
                </Text>
              </>
            ) : (
              <Text style={styles.address}>Chưa cập nhật địa chỉ nhận hàng</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="edit" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <TextInput style={styles.addressNote} placeholder="Ghi chú về địa chỉ giao hàng" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cùng tôi khám phá giỏ hàng của bạn</Text>
        <FlatList
      data={[...selectedProducts, ...promotionalItems]}
      renderItem={renderProductItem}
      keyExtractor={(item, index) => item._id || `${item.product._id}-${index}`}
    />

      </View>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng số tiền</Text>
          <Text style={styles.totalPrice}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
        </View>

        {appliedDiscount && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng sau giảm giá</Text>
            <Text style={styles.discountedTotalPrice}>{discountedTotal.toLocaleString('vi-VN')}đ</Text>
          </View>
        )}

        <View style={styles.paymentOptionsContainer}>
          <TouchableOpacity
            style={styles.discountButton}
            onPress={() => navigation.navigate('PaymentMethodScreen', {
              onSelectPaymentMethod: (selectedMethod) => setPaymentMethod(selectedMethod),
            })}
          >
            <Text style={styles.discountText}>{paymentMethod || 'Chọn phương thức thanh toán'}</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="gray" />
          </TouchableOpacity>

          <Text style={styles.separator}>|</Text>

          {/* <TouchableOpacity
            style={styles.discountButton}
            onPress={() =>
              navigation.navigate('DiscountScreen', {
                onSelectDiscount: handleSelectDiscount,
                totalAmount,
              })
            }
          >
            <Text style={styles.discountText}>Ưu đãi</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="gray" />
          </TouchableOpacity> */}

<TouchableOpacity
  style={styles.discountButton}
  onPress={() => {
    console.log("Selected Products with Units:", selectedProducts.map(product => ({
      id: product.product._id,
      name: product.product.name,
      unit: product.unit,
      quantity: product.quantity,
    })));
    navigation.navigate('DiscountScreen', {
      onSelectDiscount: handleSelectDiscount,
      totalAmount,
      selectedProducts: selectedProducts.map((product) => ({
        ...product,
        unit: product.unit, // Truyền đơn vị
      })),
    });
  }}
>
  <Text style={styles.discountText}>Ưu đãi</Text>
  <MaterialIcons name="arrow-drop-down" size={20} color="gray" />
</TouchableOpacity>


          <Text style={styles.separator}>|</Text>

          <View style={styles.appliedDiscount}>
            <Text style={styles.appliedDiscountText}>{appliedDiscount ? appliedDiscount.label || appliedDiscount.code : "Ưu đãi áp dụng"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
          <Text style={styles.orderButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, marginTop: 40 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  addressContainer: { flexDirection: 'row', alignItems: 'center' },
  addressDetails: { flex: 1, marginLeft: 10 },
  address: { fontSize: 16, fontWeight: 'bold' },
  subAddress: { color: '#888' },
  addressNote: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 8, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemTitle: { fontSize: 16 },
  itemQuantity: { color: '#888' },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  promotionalText: { color: '#4CAF50', fontStyle: 'italic' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#FFF',
  },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  discountedTotalPrice: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  paymentOptionsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 10 },
  discountButton: { flex: 1, alignItems: 'center', flexDirection: 'row' },
  discountText: { color: '#333', marginRight: 4 },
  appliedDiscount: { flex: 1, alignItems: 'center' },
  appliedDiscountText: { color: '#333' },
  separator: { fontSize: 16, color: '#888', paddingHorizontal: 5 },
  orderButton: { marginTop: 10, backgroundColor: '#ffcc00', paddingVertical: 15, alignItems: 'center', borderRadius: 5 },
  orderButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});