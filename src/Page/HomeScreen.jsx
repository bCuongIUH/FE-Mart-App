import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../untills/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef(null);

  const productData = [
    { id: '1', name: 'Texas Chicken - Quang Trung', image: 'https://example.com/texas-chicken.jpg' },
    { id: '2', name: 'Trà Sữa MayCha - 41 Nguyễn Văn Linh', image: 'https://example.com/maycha.jpg' },
    { id: '3', name: 'Bánh Trung Thu', image: 'https://example.com/moon-cake.jpg' },
    { id: '4', name: 'Coca Cola', image: 'https://example.com/coca-cola.jpg' },
    { id: '5', name: 'Bánh mì Kebab', image: 'https://example.com/kebab.jpg' },
    { id: '6', name: 'Trà sữa Gong Cha', image: 'https://example.com/gongcha.jpg' },
    { id: '7', name: 'Pizza Hut', image: 'https://example.com/pizza-hut.jpg' },
    { id: '8', name: 'Gà Rán KFC', image: 'https://example.com/kfc.jpg' },
    { id: '9', name: 'Cà Phê Highlands', image: 'https://example.com/highlands.jpg' },
    { id: '10', name: 'Lotteria', image: 'https://example.com/lotteria.jpg' },
    { id: '11', name: 'Texas Chicken - Quang Trung', image: 'https://example.com/texas-chicken.jpg' },
    { id: '12', name: 'Trà Sữa MayCha - 41 Nguyễn Văn Linh', image: 'https://example.com/maycha.jpg' },
    { id: '13', name: 'Bánh Trung Thu', image: 'https://example.com/moon-cake.jpg' },
    { id: '14', name: 'Coca Cola', image: 'https://example.com/coca-cola.jpg' },
    { id: '15', name: 'Bánh mì Kebab', image: 'https://example.com/kebab.jpg' },
    { id: '16', name: 'Trà sữa Gong Cha', image: 'https://example.com/gongcha.jpg' },
    { id: '17', name: 'Pizza Hut', image: 'https://example.com/pizza-hut.jpg' },
    { id: '18', name: 'Gà Rán KFC', image: 'https://example.com/kfc.jpg' },
    { id: '19', name: 'Cà Phê Highlands', image: 'https://example.com/highlands.jpg' },
    { id: '20', name: 'Lotteria', image: 'https://example.com/lotteria.jpg' },
  ];

  const fetchProducts = useCallback(() => {
    setLoading(true);
    try {
      setProducts(productData);
      setVisibleProducts(productData.slice(0, 6)); 
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleShowMore = () => {
    const nextProductsCount = visibleProducts.length + 6;
    setVisibleProducts(products.slice(0, nextProductsCount)); 
    if (nextProductsCount >= products.length) {
      setShowMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.greeting}>Chào, {user ? user.fullName : "Người dùng"} ✨</Text>
      </View>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#A9A9A9" />
        <TextInput placeholder="Bạn muốn mua gì?" style={styles.searchInput} />
      </View>
      <View style={styles.locationTags}>
        <TouchableOpacity style={styles.locationTag}>
          <Text>Coca cola</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationTag}>
          <Text>Bánh trung thu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.servicesContainer}>
        <ServiceIcon name="Đồ gia dụng" icon="https://example.com/food-icon.png" />
        <ServiceIcon name="Nội thất" icon="https://example.com/delivery-icon.png" />
        <ServiceIcon name="Hoa quả" icon="https://example.com/bike-icon.png" />
        <ServiceIcon name="Lương thực" icon="https://example.com/car-icon.png" />
        <ServiceIcon name="Đồ uống đóng chai" icon="https://example.com/taxi-icon.png" />
        <ServiceIcon name="Mỹ phẩm" icon="https://example.com/savings-icon.png" />
      </View>
      <Text style={styles.sectionTitle}>Sản phẩm dành cho bạn</Text>
    </>
  );

  const ServiceIcon = ({ name, icon }) => (
    <TouchableOpacity style={styles.serviceIconContainer}>
      <Image source={{ uri: icon }} style={styles.serviceIcon} />
      <Text style={styles.serviceText}>{name}</Text>
    </TouchableOpacity>
  );

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Mua ngay</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(scrollY > 300);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={visibleProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={() => (
          showMore && (
            <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
              <Text style={styles.showMoreButtonText}>Xem thêm</Text>
            </TouchableOpacity>
          )
        )}
        onScroll={handleScroll}
      />

      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={() => flatListRef.current.scrollToOffset({ animated: true, offset: 0 })}
        >
          <MaterialIcons name="arrow-upward" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#D8BFD8',
    paddingVertical: 50,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  greeting: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 10,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  locationTags: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  locationTag: {
    backgroundColor: '#EEE',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  serviceIconContainer: {
    alignItems: 'center',
    marginVertical: 10,
    width: '25%',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  serviceText: {
    textAlign: 'center',
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productItem: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  buyButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buyButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  showMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
  showMoreButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
