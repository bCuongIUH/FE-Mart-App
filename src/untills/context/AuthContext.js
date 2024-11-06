// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         const encryptedUser = await AsyncStorage.getItem('user');
//         const encryptedToken = await AsyncStorage.getItem('token');

//         if (encryptedUser && encryptedToken) {
//           const bytesUser = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
//           const decryptedUser = JSON.parse(bytesUser.toString(CryptoJS.enc.Utf8));
          
//           const bytesToken = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
//           const decryptedToken = bytesToken.toString(CryptoJS.enc.Utf8);

//           if (decryptedUser && decryptedToken) { // Kiểm tra thêm để tránh null
//             setUser({ ...decryptedUser, token: decryptedToken });
//           }
//         }
//       } catch (error) {
//         console.error('Error decrypting user data:', error);
//       }
//     };

//     loadUserData();
//   }, []);

//   const login = async (userData) => {
//     try {
//       if (userData && userData.token) { // Kiểm tra xem userData có chứa token không
//         const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();
//         const encryptedToken = CryptoJS.AES.encrypt(userData.token, SECRET_KEY).toString();

//         setUser(userData);
//         await AsyncStorage.setItem('user', encryptedUser);
//         await AsyncStorage.setItem('token', encryptedToken);
//       } else {
//         console.warn('Invalid userData or missing token');
//       }
//     } catch (error) {
//       console.error('Error encrypting user data:', error);
//     }
//   };
  
//   const logout = async () => {
//     setUser(null);
//     await AsyncStorage.removeItem('user');
//     await AsyncStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    useEffect(() => {
      // Tải user từ AsyncStorage khi ứng dụng khởi động
      const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      };
      loadUser();
    }, []);

    const login = async (userData) => {
      if (userData) {
        setUser(userData); // Cập nhật state `user`
        await AsyncStorage.setItem('user', JSON.stringify(userData)); // Lưu `user` vào AsyncStorage
      }
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
