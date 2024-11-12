import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProductListScreen({ route }) {
  const { products, searchQuery } = route.params;
  const navigation = useNavigation();

  // Điều hướng đến `ProductInfo` khi nhấn vào sản phẩm
  const handleProductPress = (product) => {
    navigation.navigate('ProductInfo', { product });
  };

  // Render một mục sản phẩm
  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
      <View style={styles.productHeader}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productRating}>⭐ 4.9 (999+)</Text>
        
        </View>
      </View>
      <View style={styles.productPricing}>
        {item.units.map((unit, index) => (
          <View key={index} style={styles.unitInfo}>
            <Text style={styles.unitName}>{unit.unitName}</Text>
            <Text style={styles.unitPrice}>{unit.price}đ</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Kết quả tìm kiếm cho {searchQuery}</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 45,
    paddingHorizontal: 10,
    backgroundColor: '#ffcc00', 
  },
  goBackButton: {
    padding: 5,
    marginRight: 10,
    top : 10,  
  },
  headerText: { 
    top : 10,   
    fontSize: 18, 
    fontWeight: 'bold', 
    // textAlign: 'center', 
    flex: 1,
  },
  productItem: {
    backgroundColor: '#FFF',
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  productHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  productImage: { width: 60, height: 60, borderRadius: 8 },
  productInfo: { marginLeft: 10, flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  productRating: { color: '#666', fontSize: 14, marginTop: 2 },
  productDistance: { color: '#666', fontSize: 14, marginTop: 2 },
  productPricing: { marginTop: 10 },
  unitInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  unitName: { color: '#333' },
  unitPrice: { color: '#333', fontWeight: 'bold' },
  listContent: { padding: 10 },
});
