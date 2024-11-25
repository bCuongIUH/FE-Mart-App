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
import { MaterialIcons } from '@expo/vector-icons';
import { createReturnRequest } from '../untills/api';
import { ActivityIndicator } from '@ant-design/react-native';

export default function ReturnRequestScreen({ route, navigation }) {
  const { bill } = route.params;
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReasonError, setIsReasonError] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  
  if (!bill) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy thông tin hóa đơn.</Text>
      </View>
    );
  }

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      setAttachments([result.assets[0].uri]);
      setIsImageError(false);
    } else {
      console.error('Không chọn ảnh hoặc kết quả không đúng:', result);
    }
  };
  
  const handleSubmit = async () => {
    let isValid = true;
  
    if (!reason.trim()) {
      setIsReasonError(true);
      isValid = false;
    } else {
      setIsReasonError(false);
    }
  
    if (attachments.length === 0) {
      setIsImageError(true);
      isValid = false;
    } else {
      setIsImageError(false);
    }
  
    if (!isValid) return;
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('billId', bill.id);
    formData.append('reason', reason.trim());
  
    if (attachments.length > 0) {
      const uri = attachments[0];
      const filename = uri.split('/').pop();
      const type = `image/${filename.split('.').pop().replace('jpg', 'jpeg')}`;
      formData.append('images', {
        uri,
        name: filename,
        type,
      });
    }
  
    try {
      const response = await createReturnRequest(formData);
  
      if (response.success) {
        navigation.navigate({
          name: 'OrderDetailScreen',
          params: {
            updatedBill: {
              ...bill,
              status: 'DangXuLy',
            },
          },
          merge: true,
        });
      } else {
        throw new Error(response.message || 'Phản hồi không hợp lệ từ API.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu hoàn trả:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yêu cầu hoàn trả</Text>
      </View>
  
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
  
     <View style={styles.section}>
      <Text style={styles.sectionTitle}>Lý do hoàn trả</Text>
      <View style={[styles.inputContainer, isReasonError && styles.errorBorder]}>
        <TextInput
          style={styles.textInput}
          placeholder={isReasonError ? "Vui lòng nhập lý do hoàn trả" : "Nhập lý do..."}
          placeholderTextColor={isReasonError ? "red" : "#999"}
          multiline
          value={reason}
          onChangeText={(text) => {
            setReason(text);
            if (text.trim()) setIsReasonError(false);
          }}
        />
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ảnh minh họa</Text>
      <View style={styles.attachmentsContainer}>
        <View style={[styles.imageContainer, isImageError && styles.errorBorder]}>
          {attachments.length > 0 ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: attachments[0] }} style={styles.attachmentImage} />
              <TouchableOpacity style={styles.editButton} onPress={handleAddImage}>
                <MaterialIcons name="edit" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
              <Text style={styles.addImageText}>+ Thêm </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={!loading ? handleSubmit : null} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
        )}
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
  inputContainer: {
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textInput: {
    height: 100,
    padding: 10,
    textAlignVertical: 'top',
  },
  attachmentsContainer: {
    alignItems: 'flex-start',
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  attachmentImage: {
    width: 80,
    height: 80,
  },
  addImageButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  addImageText: {
    fontSize: 14,
    color: '#555',
  },
  editButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 15,
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
});