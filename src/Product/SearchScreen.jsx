import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAllPriceProduct } from '../untills/api';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState(''); 
  const [allProducts, setAllProducts] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);
  const navigation = useNavigation();

  // Hàm gọi API lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const productData = await getAllPriceProduct();
      if (productData.success && Array.isArray(productData.prices)) {
        setAllProducts(productData.prices);
        setSuggestions(productData.prices.slice(0, 10)); 
      } else {
        console.error("Lỗi: API không trả về mảng sản phẩm hợp lệ");
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
    if (searchQuery) {
      // Lọc sản phẩm theo từ khóa tìm kiếm
      const filteredProducts = allProducts.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredProducts.slice(0, 10)); // Hiển thị tối đa 10 sản phẩm phù hợp
    } else {
      // Khi không có từ khóa, hiển thị các sản phẩm đề xuất ban đầu
      setSuggestions(allProducts.slice(0, 10));
    }
  }, [searchQuery, allProducts]);


  // Điều hướng đến `ProductListScreen` với danh sách sản phẩm phù hợp
  const handleSearch = () => {
    const filteredProducts = allProducts.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    navigation.navigate('ProductListScreen', { products: filteredProducts, searchQuery });
    Keyboard.dismiss();
  };

  // Điều hướng đến `ProductInfo` khi nhấn vào gợi ý sản phẩm
  const handleSuggestionPress = (product) => {
    navigation.navigate('ProductInfo', { product });
    Keyboard.dismiss(); 
  };

  // Hàm render một sản phẩm gợi ý
  const renderSuggestion = ({ item }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionPress(item)}>
      <MaterialIcons name="search" size={20} color="#333" />
      <Text style={styles.suggestionText}>{item.productName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ top: 20 }}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          placeholder="Bạn muốn mua gì?"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <MaterialIcons name="close" size={24} color="#333"  />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Danh sách gợi ý tìm kiếm hoặc sản phẩm đề xuất */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'ĐỀ XUẤT CHO BẠN'}
        </Text>
        <FlatList
          data={suggestions}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item.productId}
          style={styles.suggestionsList}
        />
      </View>

      {/* Nút tìm kiếm */}
      {searchQuery ? (
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Tìm kiếm "{searchQuery}"</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffcc00', 
    borderRadius: 8, 
    padding: 40, 
    marginBottom: 10,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 16, 
    top: 20,
  },
  clearButton: { padding: 8, top: 20 },
  suggestionsContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, paddingLeft: 10 },
  suggestionsList: { flexDirection: 'row', flexWrap: 'wrap' },
  suggestionItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  suggestionText: { 
    marginLeft: 10, 
    fontSize: 16, 
    color: '#333',
  },
  searchButton: { 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#ffcc00', 
    marginHorizontal: 10, 
    borderRadius: 8, 
    marginTop: 20,
  },
  searchButtonText: { 
    fontSize: 16, 
    color: '#333', 
    fontWeight: 'bold' 
  },
});
