import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CartScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Giỏ Hàng</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
