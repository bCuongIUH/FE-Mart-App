import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../untills/context/AuthContext';
import { getAllCustomers, getCart, updateCartStatus } from '../untills/api'; 

export default function CartScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); 
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [timeouts, setTimeouts] = useState({});
  const [cartId, setCartId] = useState(null);
  // Lấy giỏ hàng và thiết lập timeout cho từng sản phẩm
  useEffect(() => {
    const fetchCustomerAndCart = async () => {
      try {
        if (!user || !user._id) {
          console.error("User không có _id hoặc user không tồn tại");
          return;
        }

        const customerData = await getAllCustomers();
        const currentCustomer = customerData.find(cust => cust.CustomerId === user._id);

        if (currentCustomer) {
          setCustomer(currentCustomer);
          const cartData = await getCart(currentCustomer._id);
          setProducts(cartData && cartData.items ? cartData.items : []);
          
          if (cartData && cartData._id) {
            setCartId(cartData._id); // Lưu lại cartId từ dữ liệu giỏ hàng
          }

          // Thiết lập timeout cho từng sản phẩm trong giỏ hàng
          const newTimeouts = {};
          cartData.items.forEach(item => {
            newTimeouts[item._id] = setTimeout(() => {
              handleTimeout(item._id, cartData._id); // Truyền cả cartId và itemId vào
            }, 60 * 1000); // 1 phút
          });
          setTimeouts(newTimeouts);
        } else {
          console.error("Không tìm thấy khách hàng");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setProducts([]); 
        } else {
          console.error("Lỗi khi lấy dữ liệu:", err);
        }
      }
    };

    if (user) {
      fetchCustomerAndCart();
    }

    // Xóa timeout khi rời khỏi màn hình
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, [user]);

  const handleTimeout = async (itemId, cartId) => {
    try {
      await updateCartStatus(cartId, itemId);
      setProducts(prevProducts =>
        prevProducts.map(item =>
          item._id === itemId ? { ...item, status: "ChuaChon" } : item
        )
      );
      console.log(`Trạng thái của sản phẩm ${itemId} đã được cập nhật thành "ChuaChon"`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };


  const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VNĐ`;

  const toggleSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setProducts(products.filter((product) => !selectedItems.includes(product.productId)));
    setSelectedItems([]);
  };

  const handleCheckout = () => {
    console.log("Selected Items:", selectedItems); 
  
    const selectedProducts = products.filter(product => selectedItems.includes(product.productId || product._id));
    console.log("Các sản phẩm đã chọn:", selectedProducts); 
  
    navigation.navigate('CheckoutScreen', { selectedProducts });
  };
  const renderProduct = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>{formatCurrency(item.currentPrice)}</Text>
        <Text style={styles.productUnit}>{item.unit} ({item.quantity})</Text>
        {item.status === "ChuaChon" && <Text style={styles.timeoutText}>Đã hết hạn thanh toán</Text>}
      </View>
      <CheckBox
        checked={selectedItems.includes(item._id)}
        onPress={() => toggleSelection(item._id)}
        containerStyle={styles.checkBox}
        disabled={item.status === "ChuaChon"} // Vô hiệu hóa checkbox nếu item ở trạng thái "ChuaChon"
      />
    </View>
  );
  

  const totalAmount = selectedItems.reduce((sum, itemId) => {
    const item = products.find(product => product._id === itemId);
    return sum + (item ? item.currentPrice * item.quantity : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons style={{ top: 20, marginRight: 10 }} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
        {selectedItems.length > 0 && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
      />

      {selectedItems.length > 0 && (
        <View style={styles.footerContainer}>
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>Tổng: {formatCurrency(totalAmount)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      )}

      {products.length === 0 && (
        <View style={styles.emptyCartContainer}>
          <MaterialIcons name="receipt-long" size={80} color="#888" />
          <Text style={styles.emptyCartText}>Giỏ hàng hiện đang trống.</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.goBack()}>
            <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 35 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#333', top: 20 },
  deleteButton: { top: 20 },
  cartItem: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 8, padding: 10, marginVertical: 8, marginHorizontal: 16, alignItems: 'center' },
  productImage: { width: 80, height: 80, marginRight: 16, borderRadius: 8 },
  productDetails: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productPrice: { color: '#888', marginTop: 4 },
  productUnit: { color: '#666', marginTop: 2 },
  timeoutText: { color: 'red', fontSize: 14, fontStyle: 'italic', marginTop: 4 },
  footerContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#DDD', backgroundColor: '#FFF' },
  totalAmountContainer: { flex: 0.4, justifyContent: 'center' },
  totalAmountText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  checkoutButton: { flex: 0.6, backgroundColor: '#D8BFD8', paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  checkoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  emptyCartContainer: { flex: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyCartText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20 },
  exploreButton: { backgroundColor: '#D8BFD8', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, marginTop: 20 },
  exploreButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
