import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../untills/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getAllPriceProduct } from '../untills/api';

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


//lấy ds sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      // setLoading(true); 
      try {
        const data = await getAllPriceProduct();
        if (data.success) {
          setProducts(data.prices);
          setVisibleProducts(data.prices.slice(0, 6));
        } else {
          Alert.alert("Lỗi", data.message);
        }
      } catch (err) {
        Alert.alert("Lỗi", err.message);
      } finally {
        // setLoading(false); 
      }
    };
    fetchProducts();
  }, []);





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
    navigation.navigate('ProductInfo', { product });
    console.log(product);
    
  };
  const handleProductCart = (product) => {
    navigation.navigate('ProductCart', { product });
    console.log("12",product);
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.productName}</Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text onPress={()=> handleProductCart(item)} style={styles.buyButtonText}>Mua ngay</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#FFD700" />
  //     </View>
  //   );
  // }

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(scrollY > 600);
  };

  return (
    <View style={styles.container}>
      <FlatList
          ref={flatListRef}
          data={visibleProducts}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.productId || index}-${index}`}
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
    backgroundColor: '#D8BFD8',
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
    backgroundColor: '#F2E8F2',
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
    right: 15,
    bottom: 15,
    backgroundColor: '#F2E8F2',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
