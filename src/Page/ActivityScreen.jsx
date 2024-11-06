import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ActivityScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Hoạt Động</Text>
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
