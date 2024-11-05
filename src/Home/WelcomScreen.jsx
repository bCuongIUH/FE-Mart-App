import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.titleText}>
        Siêu thị C'Mart
      </Text>

      {/* Image Centered */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/welcome1.png')}
          style={styles.imageStyle}
        />
      </View>

      {/* Sign Up Button */}
      <View style={styles.spacing}>
        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpButtonText}>Đăng kí</Text>
        </TouchableOpacity>
      </View>

      {/* Already have an account */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Bạn đã có tài khoản ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}> Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8BFD8',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  titleText: {
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 32, 
    textAlign: 'center', 
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 16,
    alignItems: 'center', 
  },
  imageStyle: {
    width: 350,
    height: 350,
  },
  spacing: {

    marginVertical: 16, 
  },
  signUpButton: {
    paddingVertical: 12, 
    backgroundColor: '#F59E0B', 
    marginHorizontal: 28, 
    borderRadius: 16, 
    alignItems: 'center', 
  },
  signUpButtonText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#4B5563', 
  },
  footerContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 16,
  },
  footerText: {
    color: '#FFFFFF', 
    fontWeight: '600', 
  },
  loginText: {
    fontWeight: '600', 
    color: '#F59E0B',
  },
});
