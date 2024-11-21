import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {MaterialIcons } from '@expo/vector-icons';
import { createReturnRequest } from '../untills/api';
export default function ReturnRequestScreen({ route, navigation }) {
  const { bill } = route.params;
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState([]);

  if (!bill) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy thông tin hóa đơn.</Text>
      </View>
    );
  }

  const handleAddImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        'Quyền truy cập bị từ chối',
        'Ứng dụng cần quyền truy cập thư viện ảnh để tải lên.'
      );
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  
    if (result.canceled === false && result.assets) {
      // Sử dụng 'result.assets[0].uri' để lấy ảnh
      setAttachments([...attachments, result.assets[0].uri]);
    } else {
      console.error("Không chọn ảnh hoặc kết quả không đúng:", result);
    }
  };
  
  //gửi yêu cầu hoàn trả
  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do hoàn trả.');
      return;
    }
  
    const requestData = {
      billId: bill.id,
      reason: reason.trim(),
      images: attachments,
    };
  
    try {
      const response = await createReturnRequest(requestData); // Gọi API
      console.log('Response from API:', response);
  
      if (response && response.data) {
        Alert.alert('Thành công', 'Yêu cầu hoàn trả của bạn đã được gửi thành công!');
  
        // Gửi thông tin cập nhật trở lại màn hình trước
        navigation.navigate({
          name: 'OrderDetailScreen',
          params: {
            updatedBill: {
              ...bill,
              status: 'DangXuLy',
            },
          },
          merge: true, // Đảm bảo params được cập nhật
        });
      } else {
        throw new Error('Phản hồi không hợp lệ từ API.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu hoàn trả:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi yêu cầu hoàn trả.');
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yêu cầu hoàn trả</Text>
      </View>
  
      {/* Thông tin hóa đơn */}
      <View style={styles.billDetails}>
        <Text style={styles.label}>Mã hóa đơn:</Text>
        <Text style={styles.value}>{bill.billCode}</Text>
  
        <Text style={styles.label}>Trạng thái:</Text>
        <Text style={styles.value}>{bill.status}</Text>
  
        <Text style={styles.label}>Tổng tiền:</Text>
        <Text style={styles.value}>
          {bill.totalPrice.toLocaleString('vi-VN')}đ
        </Text>
      </View>
  
      {/* Lý do hoàn trả */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lý do hoàn trả</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập lý do..."
          multiline
          value={reason}
          onChangeText={setReason}
        />
      </View>
  
      {/* Đính kèm hình ảnh */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ảnh minh họa</Text>
        <View style={styles.attachmentsContainer}>
          {attachments.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.attachmentImage} />
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
            <Text style={styles.addImageText}>+ Thêm </Text>
          </TouchableOpacity>
        </View>
      </View>
  
      {/* Nút gửi yêu cầu */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    padding: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    left: -20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // textAlign: 'center',
    flex: 1,
    left: -20,
  },

  billDetails: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    height: 100,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  attachmentImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  addImageButton: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  addImageText: {
    fontSize: 14,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#ffcc00',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
