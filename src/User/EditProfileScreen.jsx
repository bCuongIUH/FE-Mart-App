import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAllCustomers, updateCustomer } from '../untills/api';

export default function EditProfileScreen() {
    const route = useRoute();
    const { customer } = route.params;

    const [fullName, setFullName] = useState(customer.fullName || "");
    const [email, setEmail] = useState(customer.email || "");
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNumber || "");
    const [dateOfBirth, setDateOfBirth] = useState(customer.dateOfBirth ? new Date(customer.dateOfBirth) : null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [address, setAddress] = useState({
        houseNumber: customer.addressLines.houseNumber || "",
        ward: customer.addressLines.ward || "",
        district: customer.addressLines.district || "",
        province: customer.addressLines.province || "",
    });
    const [isAddressModalVisible, setAddressModalVisibility] = useState(false);

    const navigation = useNavigation();


 //regex
 //tên
 const capitalize = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isValidName = (name) => {
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểÌỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễễịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    return nameRegex.test(name);
  };
  const normalizeName = (name) => {
    return name
      .trim() 
      .replace(/\s+/g, ' ')
      .split(' ') // Tách các từ
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(' '); 
  };
  
  
  //nút update
  const handleUpdate = async () => {
    // Kiểm tra nếu trường nào còn trống
    if (!fullName.trim() || !dateOfBirth || !address.houseNumber.trim() || !address.ward.trim() || !address.district.trim() || !address.province.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
        return;
    }
      // Chuẩn hóa tên
      const formattedName = normalizeName(fullName);
      setFullName(formattedName);

    if (!isValidName(fullName)) {
        Alert.alert("Lỗi", "Tên chỉ được chứa chữ cái tiếng Việt và dấu cách.");
        return;
    }

    const updatedData = {
        fullName: formattedName,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
        addressLines: address,
    };

    try {
        // Gọi API để cập nhật dữ liệu
        const response = await updateCustomer(customer._id, updatedData);
        Alert.alert("Thành công", "Thông tin khách hàng đã được cập nhật.");
    
        // navigation.goBack();
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        Alert.alert("Lỗi", `Không thể cập nhật thông tin khách hàng: ${errorMessage}`);
    }
};

    

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDateOfBirth(date);
        hideDatePicker();
    };

    const handleAddressChange = (field, value) => {
        setAddress((prevAddress) => ({ ...prevAddress, [field]: value }));
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ left: -20, top: 10 }}>
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
                </View>

                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/man-avatar.jpg')} style={styles.avatar} />
                </View>

                {/* Form */}
                <View style={styles.form}>
                <Text style={styles.label}>Họ và Tên</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={(text) => setFullName(capitalize(text))}
                    />
                    <Text style={styles.label}>Email</Text>
                    <View>
                        <TextInput
                            style={styles.input}
                            value={email}
                            editable={false}
                        />
                        <MaterialIcons name="check-circle" size={20} color="green" />
                    </View>
                    <Text style={styles.subText}>Email của bạn đã được xác nhận</Text>

                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        editable={false}
                    />

                    <Text style={styles.label}>Ngày sinh</Text>
                    <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                        <Text>{dateOfBirth ? dateOfBirth.toLocaleDateString("vi-VN") : "Chọn ngày sinh"}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        textColor="#000"
                    />

                    <Text style={styles.label}>Địa chỉ</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setAddressModalVisibility(true)}>
                        <Text>{`${address.houseNumber} ${address.ward} ${address.district} ${address.province}`}</Text>
                    </TouchableOpacity>
                </View>

                {/* Nút cập nhật */}
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                    <Text style={styles.updateButtonText}>Cập nhật</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal chỉnh sửa địa chỉ */}
            <Modal
                visible={isAddressModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setAddressModalVisibility(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Số nhà</Text>
                        <TextInput
                            style={styles.input}
                            value={address.houseNumber}
                            onChangeText={(text) => handleAddressChange('houseNumber', text)}
                        />

                        <Text style={styles.label}>Phường</Text>
                        <TextInput
                            style={styles.input}
                            value={address.ward}
                            onChangeText={(text) => handleAddressChange('ward', text)}
                        />

                        <Text style={styles.label}>Quận</Text>
                        <TextInput
                            style={styles.input}
                            value={address.district}
                            onChangeText={(text) => handleAddressChange('district', text)}
                        />

                        <Text style={styles.label}>Thành phố</Text>
                        <TextInput
                            style={styles.input}
                            value={address.province}
                            onChangeText={(text) => handleAddressChange('province', text)}
                        />

                        <TouchableOpacity style={styles.updateButton} onPress={() => setAddressModalVisibility(false)}>
                            <Text style={styles.updateButtonText}>Lưu địa chỉ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 40,
        backgroundColor: '#f9f9f9',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        left: -20,
        top: 10
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 40,
    },
    form: {
        marginTop: 20,
        padding: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    subText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 15,
    },
    updateButton: {
        backgroundColor: '#888',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 16,
    },
    updateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
    },
});
