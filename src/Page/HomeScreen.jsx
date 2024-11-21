import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../untills/context/AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllCustomers, getAllPriceProduct } from '../untills/api';

const categories = [
  { name: 'Đồ gia dụng', category: 'Đồ gia dụng', icon: require('../../assets/images/do-gia-dung.png') },
  { name: 'Dụng cụ học tập', category: 'Dụng cụ học tập', icon: require('../../assets/images/dung-cu-hoc-tap.png') },
  { name: 'Hoa quả', category: 'Hoa quả', icon: require('../../assets/images/hoa-qua.png') },
  { name: 'Đồ hộp', category: 'Đồ hộp', icon: require('../../assets/images/do-hop.png') },
  { name: 'Đồ uống đóng chai', category: 'Đồ uống đóng chai', icon: require('../../assets/images/do-uong.png') },
  { name: 'Mỹ phẩm', category: 'Mỹ phẩm', icon: require('../../assets/images/my-pham.png') },
];
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
  const [customer, setCustomer] = useState([]);
 
  
  
   // Hàm lấy thông tin sản phẩm và khách hàng
   const fetchProductsAndCustomer = async () => {
    if (!user) return;
    try {
      const productData = await getAllPriceProduct();
      if (productData.success) {
        setProducts(productData.prices);
        setVisibleProducts(productData.prices.slice(0, 6));
      } else {
        Alert.alert("Lỗi", productData.message);
      }

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

  // Gọi hàm fetchProductsAndCustomer mỗi khi màn hình focus lại và khi `user` thay đổi
  useFocusEffect(
    useCallback(() => {
      fetchProductsAndCustomer();
    }, [user]) // useCallback sẽ chỉ chạy lại khi `user` thay đổi
  );



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
      <Text style={styles.greeting}>Chào, {customer ? customer.fullName : "Người dùng"} ✨</Text>
      </View>
      <View style={styles.searchContainer}>
      <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('Search')}>
        <FontAwesome name="search" size={20} color="#A9A9A9" />
        <TextInput 
          placeholder="Bạn muốn mua gì?" 
          style={styles.searchInput} 
          editable={false}  // Làm cho input không thể chỉnh sửa
          pointerEvents="none" // Đảm bảo không nhận sự kiện từ TextInput
        />
      </TouchableOpacity>

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
        {categories.map((cat, index) => (
          <ServiceIcon
            key={index}
            name={cat.name}
            icon={cat.icon}
            category={cat.category}
          />
        ))}
      </View>
   
      {/* <View style={styles.servicesContainer}>
        <ServiceIcon name="Đồ gia dụng" icon={require('../../assets/images/do-gia-dung.png')} />
        <ServiceIcon name="Dụng cụ học tập" icon={require('../../assets/images/dung-cu-hoc-tap.png')} />
        <ServiceIcon name="Hoa quả" icon={require('../../assets/images/hoa-qua.png')} />
        <ServiceIcon name="Đồ hộp" icon={require('../../assets/images/do-hop.png')} />
        <ServiceIcon name="Đồ uống đóng chai"  icon={require('../../assets/images/do-uong.png')} />
        <ServiceIcon name="Mỹ phẩm" icon={require('../../assets/images/my-pham.png')} />
      </View> */}
      <Text style={styles.sectionTitle}>Sản phẩm dành cho bạn</Text>
    </>
  );

  const ServiceIcon = ({ name, icon, category }) => (
    <TouchableOpacity
      style={styles.serviceIconContainer}
      onPress={() => navigation.navigate('CategoryScreen', { category })}
    >
      <Image source={typeof icon === 'string' ? { uri: icon } : icon} style={styles.serviceIcon} />
      <Text style={styles.serviceText}>{name}</Text>
    </TouchableOpacity>
  );

  const handleProductPress = (product) => {
    navigation.navigate('ProductInfo', { product });
  };

  const handleProductCart = (product) => {
    navigation.navigate('ProductCart', { product });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.productName}</Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text onPress={() => handleProductCart(item)} style={styles.buyButtonText}>Mua ngay</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
    backgroundColor: '#ffcc00',
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
    // padding: 10,
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
    borderRadius : 15,  
    borderWidth: 1,      
    borderColor: '#888',  

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
    backgroundColor: '#ffcc00',
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
    backgroundColor: '#ffcc00',
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
    backgroundColor: '#ffcc00',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
