import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const recentSearches = [
    { id: '1', title: 'Trà sữa MayCha Deal 1K' },
    { id: '2', title: 'Gà Rán Popeyes combo 159K' },
    { id: '3', title: 'Trà Sữa ToCoToCo 1K' },
  ];

  const suggestions = ['phúc long', 'trà sữa', 'bún thái', 'mì cay', 'bún đậu mắm tôm', 'cá viên chiên', 'gà rán'];

  const recentOrders = [
    { id: '1', title: 'Bún Thái Cay Tiên...', discount: 'Giảm 28K', image: 'https://path-to-image-1' },
    { id: '2', title: 'Phúc Long - 67 Lê Đức Thọ', image: 'https://path-to-image-2' },
    { id: '3', title: 'Phúc Long - 63 Nguyễn Văn...', image: 'https://path-to-image-3' },
  ];

  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity style={styles.recentSearchItem}>
      <Text style={styles.recentSearchLabel}>Ưu đãi</Text>
      <Text style={styles.recentSearchText}>{item.title}</Text>
      <MaterialIcons name="chevron-right" size={24} color="#333" />
    </TouchableOpacity>
  );

  const renderSuggestion = (item, index) => (
    <TouchableOpacity key={index} style={styles.suggestionItem}>
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRecentOrder = ({ item }) => (
    <TouchableOpacity style={styles.orderItem}>
      <Image source={{ uri: item.image }} style={styles.orderImage} />
      <Text style={styles.orderTitle}>{item.title}</Text>
      {item.discount && <Text style={styles.orderDiscount}>{item.discount}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{top: 20}}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          placeholder="Bạn muốn mua gì?"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Recent Searches */}
      <View style={styles.section}>
        <FlatList
          data={recentSearches}
          renderItem={renderRecentSearch}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Suggestions */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.sectionTitle}>ĐỀ XUẤT CHO BẠN</Text>
        <View style={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => renderSuggestion(suggestion, index))}
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{ uri: 'https://path-to-banner-image' }}
          style={styles.bannerImage}
        />
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ĐÃ ĐẶT GẦN ĐÂY</Text>
        <FlatList
          data={recentOrders}
          renderItem={renderRecentOrder}
          keyExtractor={(item) => item.id}
          horizontal
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF'},
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 8, padding: 40, marginBottom: 10 , backgroundColor: '#ffcc00'},
  searchInput: { marginLeft: 10, flex: 1 , top: 20},
  section: { marginBottom: 20 },
  recentSearchItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  recentSearchLabel: { color: '#FF5A5F', marginRight: 8 },
  recentSearchText: { flex: 1, fontSize: 16 },
  suggestionsContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  suggestionsList: { flexDirection: 'row', flexWrap: 'wrap' },
  suggestionItem: { backgroundColor: '#FFF2E5', borderRadius: 15, paddingVertical: 5, paddingHorizontal: 15, margin: 5 },
  suggestionText: { color: '#FF5A5F' },
  banner: { marginBottom: 20 },
  bannerImage: { width: '100%', height: 120, borderRadius: 8 },
  orderItem: { marginRight: 15, width: 120 },
  orderImage: { width: '100%', height: 100, borderRadius: 8 },
  orderTitle: { fontSize: 14, marginTop: 5 },
  orderDiscount: { color: '#FF5A5F', fontWeight: 'bold' },
});
