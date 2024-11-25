import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreenTest() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Món chính', image:require('../../assets/images/login.png')},
    { id: 2, name: 'Ăn kèm', image: require('../../assets/images/login.png')},
    { id: 3, name: 'Đồ uống', image:require('../../assets/images/login.png')},
    { id: 4, name: 'Tráng miệng', image: require('../../assets/images/login.png')},
    { id: 5, name: 'Món mới', image: require('../../assets/images/login.png')},
  ]);

  const [recommended, setRecommended] = useState([
    {
      id: 1,
      name: 'Cơm Tấm Tài',
      rating: 5,
      image: require('../../assets/images/login.png'),
    },
    {
      id: 2,
      name: 'Cơm Tấm Vạn Thành',
      rating: 5,
      image:require('../../assets/images/login.png'),
    },
  ]);

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecommended = ({ item }) => (
    <TouchableOpacity style={styles.recommendedItem}>
      <Image source={item.image} style={styles.recommendedImage} />
      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedName}>{item.name}</Text>
        <Text style={styles.recommendedRating}>
          {item.rating} <MaterialIcons name="star" size={14} color="#FFCC00" />
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerName}>Lê Quang Đại</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <MaterialIcons name="shopping-cart" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="notifications-none" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#A9A9A9" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* Recommended Section */}
      <Text style={styles.sectionTitle}>Tìm món ngon</Text>
      <View style={styles.promotionBanner}>
        <Image
          source={require('../../assets/images/login.png')}
          style={styles.promotionImage}
        />
      </View>
      <Text style={styles.sectionTitle}>Đề xuất</Text>
      <FlatList
        data={recommended}
        renderItem={renderRecommended}
        keyExtractor={(item) => item.id.toString()}
        horizontal={false}
        numColumns={2}
        contentContainerStyle={styles.recommendedContainer}
      />

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <MaterialIcons name="home" size={24} color="#FF4C4C" />
          <Text style={styles.footerTextActive}>Trang Chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <MaterialIcons name="receipt" size={24} color="#A9A9A9" />
          <Text style={styles.footerText}>Đơn Hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <MaterialIcons name="message" size={24} color="#A9A9A9" />
          <Text style={styles.footerText}>Tin Nhắn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <MaterialIcons name="person" size={24} color="#A9A9A9" />
          <Text style={styles.footerText}>Hồ Sơ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FF4C4C',
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  promotionBanner: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  promotionImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  recommendedContainer: {
    paddingHorizontal: 20,
  },
  recommendedItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 120,
  },
  recommendedInfo: {
    padding: 10,
  },
  recommendedName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  recommendedRating: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingVertical: 10,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#A9A9A9',
  },
  footerTextActive: {
    fontSize: 12,
    color: '#FF4C4C',
  },
});
