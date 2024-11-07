import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';


export default function ProductInfo({ route, navigation }) {

  const { product } = route.params;
  const [selectedUnit, setSelectedUnit] = useState(product.units[0]); 
  const [price, setPrice] = useState(selectedUnit.price || 0);
  const [quantity, setQuantity] = useState(1);

//chọn đơn vị
  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
    setQuantity(1);
    setPrice(unit.price); 
  };

  //kiểm tra dữ liệu sản phẩm lỗi
  if (!product || !product.units) {
    console.error("Dữ liệu sản phẩm không hợp lệ:", product);
    return <Text>Thông tin sản phẩm không có sẵn</Text>;
  }
  
  const handleQuantityChange = (type) => {
    const newQuantity = type === 'increase' ? quantity + 1 : quantity > 1 ? quantity - 1 : 1;
    setQuantity(newQuantity);
    setPrice(selectedUnit.price * newQuantity); 
  };
//chuyển chuỗi thành tiền
  const formatCurrency = (value) => {
    return `${value.toLocaleString('vi-VN')} VNĐ`;
  };
  //nút thêm vào giỏ
  const handleAddToCart = () => {  
    navigation.navigate('CartScreen', {
      productId: product.productId,
      productName: product.productName,
      price: price,
      image: product.image,
      unitName: selectedUnit.unitName,
      quantity: quantity,
    });
  };
  
  
  return (
    <View style={styles.container}>
      {/* image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* tiêu đề chính của sp */}
      <View style={styles.detailsContainer}>
      <Text style={styles.productTitle}>{product.productName}</Text>
        <View style={styles.productInfoRow}>
          <Text style={styles.productCategory}>{product.category}</Text>
          <Text style={[ styles.unitStockText, { color: selectedUnit.quantity > 0 ? '#888' : 'red' , fontWeight: 'bold'}]}
            >
              {selectedUnit.quantity > 0 ? `Số lượng: ${selectedUnit.quantity}` : "Hết hàng"}
            </Text>

        </View>

        {/* Rating icon */}
        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <FontAwesome name="star" size={16} color="#FFD700" />
            <FontAwesome name="star" size={16} color="#FFD700" />
            <FontAwesome name="star" size={16} color="#FFD700" />
            <FontAwesome name="star-o" size={16} color="#FFD700" />
          </View>
          <Text style={styles.soldText}>Đã bán: {product.sold || 239}</Text>
        </View>

        {/* mô tả */}
        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.productDescription}>{product.description}</Text>
        </ScrollView>

        {/* Đơn vị */}
        <View style={styles.unitSelector}>
          <Text style={styles.unitLabel}>Đơn vị</Text>
          <View style={styles.unitButtonContainer}>
            {product.units.map((unit) => (
              <TouchableOpacity
                key={unit.unitName}
                style={[
                  styles.unitButton,
                  selectedUnit.unitName === unit.unitName && styles.selectedUnitButton,
                ]}
                onPress={() => handleUnitChange(unit)}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    selectedUnit.unitName === unit.unitName && styles.selectedUnitText,
                  ]}
                >
                  {unit.unitName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
            {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleQuantityChange('decrease')} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange('increase')}  style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {/* Price and Add to Cart Button */}
        <View style={styles.footer}>
        <Text style={styles.price}>{formatCurrency(price)}</Text>
          <TouchableOpacity  onPress={handleAddToCart} style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageContainer: {
    height: '50%',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

  },

  productTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
  productInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  productCategory: { fontSize: 16, color: '#888' },
  unitStockText: { fontSize: 16, color: '#888' },

  productCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  soldText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  descriptionContainer: {
    marginVertical: 10,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  unitSelector: {
    // marginVertical: 20,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  unitButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unitButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    margin: 5,
  },
  selectedUnitButton: {
    backgroundColor:'#D8BFD8',
  },
  unitButtonText: {
    color: '#000',
  },
  selectedUnitText: {
    color: '#FFF',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 15,
    marginTop: 15,
    marginLeft: 10,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addToCartButton: {
    backgroundColor: '#D8BFD8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin :10,
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});