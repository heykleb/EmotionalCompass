// config/firebase.ts
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD0lo3n_SH2PXPBjKUf2qbwzsDtO0r-cfI",
  authDomain: "register-e583b.firebaseapp.com",
  projectId: "register-e583b",
  storageBucket: "register-e583b.firebasestorage.app",
  messagingSenderId: "364514413964",
  appId: "1:364514413964:web:6750d3b24e01f500189aa9",
  measurementId: "G-T8DN33SLB7"
};

const app = initializeApp(firebaseConfig);

// Обходим TypeScript, импортируя функцию динамически
const { getReactNativePersistence } = require('firebase/auth');

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth };

