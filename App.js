import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/Home/HomeScreen';
import WelcomScreen from './src/Home/WelcomScreen';
import LoginScreen from './src/Home/LoginScreen';
import SignUpScreen from './src/Home/SignUpScreen';
import HomePage from './src/Page/HomePage';
import OTPVerificationScreen from './src/Home/OTPVerificationScreen';
import RequireAuth from './src/untills/context/AuthenticatedRouter';
import { AuthProvider } from './src/untills/context/AuthContext';
import ProductInfo from './src/Product/ProductInfo';
import ProductCart from './src/Product/ProductCart';
import CartScreen from './src/Page/CartScreen';
import CheckoutScreen from './src/Cart/CheckoutScreen';
import DiscountComponent from './src/Discount/DiscountComponent';
import PaymentMethodScreen from './src/Payment/PaymentMethodScreen';
import EditProfileScreen from './src/User/EditProfileScreen';
import { CustomerProvider } from './src/untills/context/CustomerContext';
import SettingsScreen from './src/User/SettingsScreen';
import ChangePasswordScreen from './src/User/ChangePasswordScreen';
import ForgotPasswordScreen from './src/User/ForgotPasswordScreen';




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider> 
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
       <Stack.Screen name='Home' options={{headerShown: false}} component={HomeScreen} />
       <Stack.Screen name='Welcome' options={{headerShown: false}} component={WelcomScreen} />
       <Stack.Screen name='Login' options={{headerShown: false}} component={LoginScreen} />
       <Stack.Screen name='SignUp' options={{headerShown: false}} component={SignUpScreen} />
       <Stack.Screen name='OTP' options={{headerShown: false}} component={OTPVerificationScreen} />
       <Stack.Screen name='ProductInfo' options={{headerShown: false}} component={ProductInfo} />
       <Stack.Screen name='ProductCart' options={{headerShown: false}} component={ProductCart} />
       <Stack.Screen name='CartScreen' options={{headerShown: false}} component={CartScreen} />
       <Stack.Screen name='CheckoutScreen' options={{headerShown: false}} component={CheckoutScreen} />
       <Stack.Screen name='DiscountScreen' options={{headerShown: false}} component={DiscountComponent} />
       <Stack.Screen name='PaymentMethodScreen' options={{headerShown: false}} component={PaymentMethodScreen} />
       <Stack.Screen name='EditProfileScreen' options={{headerShown: false}} component={EditProfileScreen} />
       <Stack.Screen name="SettingsScreen" options={{headerShown: false}} component={SettingsScreen} />
       <Stack.Screen name="ChangePasswordScreen" options={{headerShown: false}} component={ChangePasswordScreen} />
       <Stack.Screen name="ForgotPasswordScreen" options={{headerShown: false}} component={ForgotPasswordScreen} />
       <Stack.Screen name='HomePage' options={{ headerShown: false }}>
          {() => (
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
}


