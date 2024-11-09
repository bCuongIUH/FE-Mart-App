import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Switch, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedProducts } = route.params;
    //phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState('Chọn phương thức thanh toán');
  //ưu đãi
  const [appliedDiscount, setAppliedDiscount] = useState("Ưu đãi áp dụng");



// tổng tiền
const totalAmount = selectedProducts.reduce((sum, item) => {
  return sum + (item.currentPrice * item.quantity || 0);
}, 0);



  //nhấn vào ưu đãi
  const handleSelectDiscount = (discount) => {
    setAppliedDiscount(discount); 
  };

console.log(selectedProducts);


  //item sản phẩm
  const renderProductItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.product.name}</Text>
        <Text style={styles.itemQuantity}>x{item.quantity} - {item.unit}</Text>
      </View>
      <Text style={styles.itemPrice}>
       {(item.currentPrice * item.quantity).toLocaleString('vi-VN')}đ
      </Text>
    </View>
  );
  

  //nút thanh toán
  const handleOrder = () => {
    console.log('Thanh toán các sản phẩm:');
    selectedProducts.forEach((item) => {
      console.log(`- Sản phẩm: ${item.product.name}, Số lượng: ${item.quantity}, Đơn giá: ${item.currentPrice.toLocaleString('vi-VN')}đ`);
    });
    console.log(`Phương thức thanh toán: ${paymentMethod}`);
    console.log(`Ưu đãi áp dụng: ${appliedDiscount}`);
  };
  
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>

      {/* Địa chỉ giao hàng */}
      <View style={styles.section}>
        <View style={styles.addressContainer}>
          <MaterialIcons name="location-on" size={24} color="gray" />
          <View style={styles.addressDetails}>
            <Text style={styles.address}>108/5/39 Nguyễn Thượng Hiền</Text>
            <Text style={styles.subAddress}>P.1, Q.Gò Vấp, Hồ Chí Minh</Text>
          </View>
          <TouchableOpacity onPress={() => {/* Chỉnh sửa địa chỉ */}}>
            <MaterialIcons name="edit" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.addressNote}
          placeholder="Ghi chú về địa chỉ giao hàng"
        />
      </View>

      {/* Chi tiết đơn hàng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cùng tôi khám phá giỏ hàng của bạn</Text>
        <FlatList
          data={selectedProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id || item.productId}
          contentContainerStyle={styles.section}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Tổng số tiền */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng số tiền</Text>
          <Text style={styles.totalPrice}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
        </View>

        {/* Lựa chọn phương thức thanh toán và ưu đãi */}
        <View style={styles.paymentOptionsContainer}>
        <TouchableOpacity
            style={styles.discountButton}
            onPress={() =>
                navigation.navigate('PaymentMethodScreen', {
                onSelectPaymentMethod: (selectedMethod) => setPaymentMethod(selectedMethod),
                })
            }
            >
            <Text style={styles.discountText}>{paymentMethod || 'Chọn phương thức thanh toán'}</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="gray" />
            </TouchableOpacity>


          <Text style={styles.separator1}>|</Text>

          <TouchableOpacity
            style={styles.discountButton}
            onPress={() =>
              navigation.navigate('DiscountScreen', { onSelectDiscount: handleSelectDiscount })
            }
          >
            <Text style={styles.discountText}>Ưu đãi</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="gray" />
          </TouchableOpacity>

          <Text style={styles.separator2}>|</Text>

          <View style={styles.appliedDiscount}>
            <Text style={styles.appliedDiscountText}>{appliedDiscount}</Text>
          </View>
        </View>

        {/* Nút thanh toán */}
        <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
          <Text style={styles.orderButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressDetails: {
    flex: 1,
    marginLeft: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subAddress: {
    color: '#888',
  },

  addressNote: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
 
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
  },
  itemQuantity: {
    color: '#888',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },

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

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  paymentOptionButton: {
    flex: 1,
    alignItems: 'center',
  },
  paymentOptionText: {
    color: '#333',
    // maxWidth: '100%',
    flexShrink: 1,
  },
  discountButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  discountText: {
    color: '#333',
    marginRight: 4,
  },
  appliedDiscount: {
    flex: 1,
    alignItems: 'center',
  },
  appliedDiscountText: {
    color: '#333',
  },
  separator1: {
    fontSize: 16,
    color: '#888',
    paddingHorizontal: 5,
  },
  separator2: {
    fontSize: 16,
    color: '#888',
    paddingHorizontal: 5,
    // marginRight
  },
  orderButton: {
    marginTop: 10,
    backgroundColor: '#D8BFD8',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});