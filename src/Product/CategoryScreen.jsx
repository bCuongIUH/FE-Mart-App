import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllPriceProduct } from '../untills/api';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllPriceProduct();
        if (response.success) {
          const filteredProducts = response.prices.filter(
            (product) => product.category === category
          );
          setProducts(filteredProducts);
        } else {
          Alert.alert('Error', 'Unable to fetch products.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Something went wrong.');
      }
    };

    fetchProducts();
  }, [category]);

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productSupplier}>{item.supplier}</Text>
        <Text style={styles.productPrice}>
          {item.units[0]?.price?.toLocaleString('vi-VN')}đ
        </Text>
        {item.units[0]?.discount && (
          <Text style={styles.productDiscount}>
            Giảm {item.units[0]?.discount.toLocaleString('vi-VN')}đ
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => navigation.navigate('ProductInfo', { product: item })}
      >
        <Text style={styles.addToCartText}>Chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có sản phẩm nào.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 55,
    backgroundColor: '#ffcc00',
  },
  backButton: {
    marginRight: 10,
    top: 10,
    left: -20,
 },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    top: 10,
    left: -20,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productSupplier: {
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935',
  },
  productDiscount: {
    fontSize: 12,
    color: '#43A047',
  },
  addToCartButton: {
    // backgroundColor: '#ffcc00',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});
