import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CartScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, productName, price, image, unitName, quantity } = route.params || {};
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Thêm sản phẩm vào giỏ nếu có dữ liệu từ route params
  React.useEffect(() => {
    if (productId && !products.some(product => product.productId === productId)) {
      setProducts((prevProducts) => [
        ...prevProducts,
        { productId, productName, price, image, unitName, quantity },
      ]);
    }
  }, [productId]);
   

  // Chuyển chuỗi thành tiền VNĐ
  const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VNĐ`;

  // Chọn và bỏ chọn sản phẩm
  const toggleSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Xóa sản phẩm đã chọn
  const handleDelete = () => {
    setProducts(products.filter((product) => !selectedItems.includes(product.productId)));
    setSelectedItems([]);
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    console.log('Thanh toán các sản phẩm:', selectedItems);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
        <Text style={styles.productUnit}>{item.unitName} ({item.quantity})</Text>
      </View>
      <CheckBox
        checked={selectedItems.includes(item.productId)}
        onPress={() => toggleSelection(item.productId)}
        containerStyle={styles.checkBox}
      />
    </View>
  );
const totalAmount = selectedItems.reduce((sum, itemId) => {
  const item = products.find(product => product.productId === itemId);
  return sum + (item ? item.price  : 0);
}, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons style={{top: 20 , marginRight : 10}} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        {/* Tiêu đề giỏ hàng */}
        <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
        
        {/* Nút xóa bên phải */}
        {selectedItems.length > 0 && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>


      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.productId}
      />

      {/* Footer với nút Thanh toán */}
      {selectedItems.length > 0 && (
        <View style={styles.footerContainer}>
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>Tổng: {formatCurrency(totalAmount)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}


      {/* Hiển thị khi giỏ hàng trống */}
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 35,
    },
    headerTitle: {
      flex: 1, 
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    
      top: 20,
    },
    deleteButton: {
    
      top: 20,
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: '#FFF',
      borderRadius: 8,
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      alignItems: 'center',
    },
    productImage: { 
      width: 80, 
      height: 80, 
      marginRight: 16, 
      borderRadius: 8 
    },
    productDetails: { 
      flex: 1 
    },
    productName: { 
      fontSize: 16, 
      fontWeight: 'bold' 
    },
    productPrice: { 
      color: '#888', 
      marginTop: 4 
    },
    productUnit: { 
      color: '#666', 
      marginTop: 2 
    },
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#DDD',
      backgroundColor: '#FFF',
    },
    totalAmountContainer: {
      flex: 0.4,
      justifyContent: 'center',
    },
    totalAmountText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    checkoutButton: {
      flex: 0.6, 
      backgroundColor: '#D8BFD8',
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    checkoutButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    emptyCartContainer: {
      flex: 10,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyCartText: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: '#333', 
      marginTop: 20 
    },
    exploreButton: {
      backgroundColor: '#D8BFD8',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      marginTop: 20,
    },
    exploreButtonText: { 
      color: '#FFF', 
      fontSize: 16, 
      fontWeight: 'bold' 
    },
  });
  