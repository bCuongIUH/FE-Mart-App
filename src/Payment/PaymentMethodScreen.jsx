import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const PaymentMethodScreen = ({ navigation, route }) => {
  const { onSelectPaymentMethod } = route.params; // Nhận hàm callback từ params

  const walletOptions = [
    { name: 'VN pay', icon: 'money', color: '#ff0066' },
  ];

  const otherPaymentOptions = [
    { name: 'Tiền mặt', icon: 'money', color: '#FFD700' },
  ];

  const sections = [
    { title: 'Ví điện tử', data: walletOptions },
    { title: 'Phương thức thanh toán khác', data: otherPaymentOptions },
  ];

  const renderItem = ({ item, section }) => {
    if (section.title === 'Ví điện tử' || section.title === 'Phương thức thanh toán khác') {
      return (
        <TouchableOpacity
          style={styles.walletOption}
          onPress={() => {
            onSelectPaymentMethod(item.name); 
            navigation.goBack(); 
          }}
        >
          <FontAwesome name={item.icon} size={20} color={item.color} style={styles.walletIcon} />
          <Text style={styles.walletText}>{item.name}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ left: -20, top: 10 }}>
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
      </View>

      {/* SectionList for Payment Options */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        renderItem={renderItem}
        contentContainerStyle={styles.section}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: -20,
    top: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 16,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  walletIcon: {
    marginRight: 10,
  },
  walletText: {
    fontSize: 16,
  },
  section: {
    paddingBottom: 10,
  },
});

export default PaymentMethodScreen;
