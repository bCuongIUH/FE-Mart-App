import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditProfileScreen() {
    const route = useRoute();
    const { customer } = route.params;

    const [fullName, setFullName] = useState(customer.fullName || "");
    const [email, setEmail] = useState(customer.email || "");
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNumber || "");
    const [dateOfBirth, setDateOfBirth] = useState(customer.dateOfBirth ? new Date(customer.dateOfBirth) : null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [address, setAddress] = useState(
      `${customer.addressLines.houseNumber || ""} ${customer.addressLines.ward || ""} ${customer.addressLines.district || ""} ${customer.addressLines.province || ""}`
    );

    const navigation = useNavigation();   

    const handleUpdate = () => {

     
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

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{left: -20, top: 10}}>
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
                </View>

                {/* Anhr */}
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/man-avatar.jpg')} style={styles.avatar} />
                     
                </View>

                {/* form */}
                <View style={styles.form}>
                    <Text style={styles.label}>Họ và Tên</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
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
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
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
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                {/* nút cap nhật*/}
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                    <Text style={styles.updateButtonText}>Cập nhật</Text>
                </TouchableOpacity>
            </ScrollView>
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
});
