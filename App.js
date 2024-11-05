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




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        {/* <AuthProvider> */}
       <Stack.Screen name='Home' options={{headerShown: false}} component={HomeScreen} />
       <Stack.Screen name='Welcome' options={{headerShown: false}} component={WelcomScreen} />
       <Stack.Screen name='Login' options={{headerShown: false}} component={LoginScreen} />
       <Stack.Screen name='SignUp' options={{headerShown: false}} component={SignUpScreen} />
       <Stack.Screen name='OTP' options={{headerShown: false}} component={OTPVerificationScreen} />

         
       <Stack.Screen name="HomePage" options={{ headerShown: false }}>
          {() => (
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          )}
        </Stack.Screen>

        {/* </AuthProvider> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


