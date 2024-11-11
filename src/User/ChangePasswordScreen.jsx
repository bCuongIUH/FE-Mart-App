import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { changePassword } from '../untills/api';

export default function ChangePasswordScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      const result = await changePassword({
        userId,
        oldPassword,
        newPassword
      });
      if (result.status === 200) {
        Alert.alert("Thành công", "Đổi mật khẩu thành công");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header với nút Go Back và tiêu đề */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi Mật Khẩu</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu cũ"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Cập Nhật Mật Khẩu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 40,
    backgroundColor: '#f2f2f2',
  },
  goBackButton: {
    top: 10,
    left: -20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    top: 10,
    left: -20,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    marginHorizontal: 10,  
  },
  button: {
    backgroundColor:  '#ffcc00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
