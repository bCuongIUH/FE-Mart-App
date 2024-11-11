// import React, { useCallback, useContext, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList, Alert } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// import { createBill, getAllCustomers } from '../untills/api';
// import { AuthContext } from '../untills/context/AuthContext';

// export default function CheckoutScreen() {
//   const { user } = useContext(AuthContext);
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { selectedProducts } = route.params;
//   const [paymentMethod, setPaymentMethod] = useState('Chọn phương thức thanh toán');
//   const [appliedDiscount, setAppliedDiscount] = useState(null);
//   const [customer, setCustomer] = useState([]);
  
//    // Hàm lấy thông tin  khách hàng
//    const fetchCustomer = async () => {
//     if (!user) return;
//     try {
//       const customerData = await getAllCustomers();
//       const currentCustomer = customerData.find(cust => cust.CustomerId === user._id);
//       if (currentCustomer) {
//         setCustomer(currentCustomer);
//       } else {
//         Alert.alert("Không tìm thấy khách hàng", "Thông tin khách hàng chưa có trong hệ thống.");
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

 
//   useFocusEffect(
//     useCallback(() => {
//       fetchCustomer();
//     }, [user])
//   );

  


//   // Tính tổng tiền
//   const totalAmount = selectedProducts.reduce((sum, item) => {
//     return sum + (item.currentPrice * item.quantity || 0);
//   }, 0);


//   // Tính tổng tiền sau khi giảm giá
//   const calculateDiscountedTotal = () => {
//     if (!appliedDiscount) return totalAmount;
//     const condition = appliedDiscount.conditions[0];
//     if (condition.discountAmount) {
//       return totalAmount - condition.discountAmount;
//     } else if (condition.discountPercentage) {
//       const discount = (totalAmount * condition.discountPercentage) / 100;
//       const maxDiscount = condition.maxDiscountAmount || discount;
//       return totalAmount - Math.min(discount, maxDiscount);
//     }
//     return totalAmount;
//   };

//   const discountedTotal = calculateDiscountedTotal();

//   // Áp dụng mã khuyến mãi
//   const handleSelectDiscount = (discount) => {
//     setAppliedDiscount(discount); // Lưu mã khuyến mãi đã chọn
//   };

//   // Hiển thị thông tin sản phẩm trong giỏ hàng
//   const renderProductItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <Image source={{ uri: item.product.image }} style={styles.itemImage} />
//       <View style={styles.itemDetails}>
//         <Text style={styles.itemTitle}>{item.product.name}</Text>
//         <Text style={styles.itemQuantity}>x{item.quantity} - {item.unit}</Text>
//       </View>
//       <Text style={styles.itemPrice}>{(item.currentPrice * item.quantity).toLocaleString('vi-VN')}đ</Text>
//     </View>
//   );


// // Nút thanh toán
// const handleOrder = async () => {
//   const finalTotal = discountedTotal ? discountedTotal : totalAmount;
//   const itemIds = selectedProducts.map(item => item._id);

//   // Kiểm tra phương thức thanh toán
//   if (!paymentMethod || paymentMethod === "Chọn phương thức thanh toán") {
//     Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán.");
//     return;
//   }

//   // Tạo JSON dữ liệu thanh toán
//   const billData = {
//     customerId: customer._id,
//     paymentMethod: paymentMethod === "Tiền mặt" ? "Cash" : paymentMethod,
//     itemIds,
//     voucherCode: appliedDiscount ? appliedDiscount.code : undefined
//   };

//   try {
//     const response = await createBill(billData);
//     Alert.alert("Thành công", "Hóa đơn của bạn đã được tạo thành công!");
//     navigation.navigate('ActivityScreen', { bill: response.bill });
//   } catch (error) {
//     // Kiểm tra xem lỗi có phản hồi từ phía backend không
//     if (error.response && error.response.status === 400) {
//       // Kiểm tra thông báo chi tiết từ backend
//       const errorMessage = error.response.data.message || "Không thể tạo hóa đơn.";
//       Alert.alert("Thông báo", errorMessage);
//     } else {
//       // In ra lỗi không phải từ backend hoặc không có thông tin chi tiết
//       Alert.alert("Lỗi", "Không thể tạo hóa đơn. Vui lòng thử lại.");
//       console.error("Lỗi khi tạo hóa đơn:", error);
//     }
//   }
// };



//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialIcons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Thanh toán</Text>
//       </View>

//       {/* Địa chỉ giao hàng */}
//       <View style={styles.section}>
//         <View style={styles.addressContainer}>
//           <MaterialIcons name="location-on" size={24} color="gray" />
//           <View style={styles.addressDetails}>
//             {customer && customer.addressLines ? (
//               <>
//                 <Text style={styles.address}>{customer.addressLines.houseNumber}</Text>
//                 <Text style={styles.subAddress}>
//                   P.{customer.addressLines.ward}, Q.{customer.addressLines.district}, {customer.addressLines.province}
//                 </Text>
//               </>
//             ) : (
//               <Text style={styles.address}>Chưa cập nhật địa chỉ nhận hàng</Text>
//             )}
//           </View>
//           <TouchableOpacity onPress={() => {}}>
//             <MaterialIcons name="edit" size={20} color="gray" />
//           </TouchableOpacity>
//         </View>

//         <TextInput style={styles.addressNote} placeholder="Ghi chú về địa chỉ giao hàng" />
//       </View>

//       {/* Chi tiết đơn hàng */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Cùng tôi khám phá giỏ hàng của bạn</Text>
//         <FlatList
//           data={selectedProducts}
//           renderItem={renderProductItem}
//           keyExtractor={(item) => item._id || item.productId}
//           contentContainerStyle={styles.section}
//         />
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <View style={styles.totalContainer}>
//           <Text style={styles.totalLabel}>Tổng số tiền</Text>
//           <Text style={styles.totalPrice}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
//         </View>

//         {appliedDiscount && (
//           <View style={styles.totalContainer}>
//             <Text style={styles.totalLabel}>Tổng sau giảm giá</Text>
//             <Text style={styles.discountedTotalPrice}>{discountedTotal.toLocaleString('vi-VN')}đ</Text>
//           </View>
//         )}

//         {/* Lựa chọn phương thức thanh toán và ưu đãi */}
//         <View style={styles.paymentOptionsContainer}>
//           <TouchableOpacity
//             style={styles.discountButton}
//             onPress={() => navigation.navigate('PaymentMethodScreen', {
//               onSelectPaymentMethod: (selectedMethod) => setPaymentMethod(selectedMethod),
//             })}
//           >
//             <Text style={styles.discountText}>{paymentMethod || 'Chọn phương thức thanh toán'}</Text>
//             <MaterialIcons name="arrow-drop-down" size={20} color="gray" />
//           </TouchableOpacity>

//           <Text style={styles.separator}>|</Text>

//           <TouchableOpacity
//             style={styles.discountButton}
//             onPress={() =>
//               navigation.navigate('DiscountScreen', {
//                 onSelectDiscount: handleSelectDiscount,
//                 totalAmount,
//               })
//             }
//           >
//             <Text style={styles.discountText}>Ưu đãi</Text>
//             <MaterialIcons name="arrow-drop-down" size={20} color="gray" />
//           </TouchableOpacity>

//           <Text style={styles.separator}>|</Text>

//           <View style={styles.appliedDiscount}>
//             <Text style={styles.appliedDiscountText}>{appliedDiscount ? appliedDiscount.label || appliedDiscount.code : "Ưu đãi áp dụng"}</Text>
//           </View>
//         </View>

//         {/* Nút thanh toán */}
//         <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
//           <Text style={styles.orderButtonText}>Thanh toán</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFF' },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 16, marginTop: 40 },
//   headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
//   section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
//   addressContainer: { flexDirection: 'row', alignItems: 'center' },
//   addressDetails: { flex: 1, marginLeft: 10 },
//   address: { fontSize: 16, fontWeight: 'bold' },
//   subAddress: { color: '#888' },
//   addressNote: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 8, marginTop: 10 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   itemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
//   itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
//   itemDetails: { flex: 1 },
//   itemTitle: { fontSize: 16 },
//   itemQuantity: { color: '#888' },
//   itemPrice: { fontSize: 16, fontWeight: 'bold' },
//   // footer: { padding: 20, borderTopWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#FFF' },
//     footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 20,
//     borderTopWidth: 1,
//     borderColor: '#e0e0e0',
//     backgroundColor: '#FFF',
//   },
//   totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
//   totalLabel: { fontSize: 16, fontWeight: 'bold' },
//   totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//   discountedTotalPrice: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
//   paymentOptionsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 10 },
//   discountButton: { flex: 1, alignItems: 'center', flexDirection: 'row' },
//   discountText: { color: '#333', marginRight: 4 },
//   appliedDiscount: { flex: 1, alignItems: 'center' },
//   appliedDiscountText: { color: '#333' },
//   separator: { fontSize: 16, color: '#888', paddingHorizontal: 5 },
//   orderButton: { marginTop: 10, backgroundColor: '#ffcc00', paddingVertical: 15, alignItems: 'center', borderRadius: 5 },
//   orderButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
// });
import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { createBill, getAllCustomers } from '../untills/api';
import { AuthContext } from '../untills/context/AuthContext';

export default function CheckoutScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedProducts } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('Chọn phương thức thanh toán');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [customer, setCustomer] = useState([]);

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
  
    const condition = appliedDiscount.conditions; // Vì conditions là đối tượng, không cần lặp qua
    
    if (condition.discountAmount) {
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
    setAppliedDiscount(discount);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.product.name}</Text>
        <Text style={styles.itemQuantity}>x{item.quantity} - {item.unit}</Text>
      </View>
      <Text style={styles.itemPrice}>{(item.currentPrice * item.quantity).toLocaleString('vi-VN')}đ</Text>
    </View>
  );

  const handleOrder = async () => {
    const finalTotal = discountedTotal ? discountedTotal : totalAmount;
    const itemIds = selectedProducts.map(item => item._id);

    if (!paymentMethod || paymentMethod === "Chọn phương thức thanh toán") {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán.");
      return;
    }

    const billData = {
      customerId: customer._id,
      paymentMethod: paymentMethod === "Tiền mặt" ? "Cash" : paymentMethod,
      itemIds,
      voucherCode: appliedDiscount ? appliedDiscount.code : undefined
    };

    try {
      const response = await createBill(billData);
      Alert.alert("Thành công", "Hóa đơn của bạn đã được tạo thành công!");
      navigation.navigate('ActivityScreen', { bill: response.bill });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || "Không thể tạo hóa đơn.";
        Alert.alert("Thông báo", errorMessage);
      } else {
        Alert.alert("Lỗi", "Không thể tạo hóa đơn. Vui lòng thử lại.");
        console.error("Lỗi khi tạo hóa đơn:", error);
      }
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
          data={selectedProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id || item.productId}
          contentContainerStyle={styles.section}
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

          <TouchableOpacity
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
