//FirebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore methods
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics'; // Import for analytics

const firebaseConfig = {
  apiKey: "AIzaSyACyvopIF8MxhP9ExvaFYwW0E8F9-uRWrw",
  authDomain: "rentistan-005.firebaseapp.com",
  databaseURL: "https://rentistan-005-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rentistan-005",
  storageBucket: "rentistan-005.appspot.com",
  messagingSenderId: "881555834519",
  appId: "1:881555834519:web:35e97843ca047ff9680bd2",
  measurementId: "G-002W4EKGP6"
};

// Initialize Firebase
let FIREBASE_APP;
if (!getApps().length) {
  FIREBASE_APP = initializeApp(firebaseConfig);
} else {
  FIREBASE_APP = getApp();
}

// Initialize Firebase services
const FIREBASE_Auth = Platform.OS !== 'web' 
  ? initializeAuth(FIREBASE_APP, { persistence: getReactNativePersistence(AsyncStorage) })
  : getAuth(FIREBASE_APP);

const FIRESTORE_DB = getFirestore(FIREBASE_APP); // Ensure this line is correct
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

// For web, optionally initialize Firebase Analytics
let FIREBASE_ANALYTICS;
if (Platform.OS === 'web') {
  FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
}

export { FIREBASE_APP, FIREBASE_Auth, FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_ANALYTICS };
