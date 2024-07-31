//FirebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore methods
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics'; // Import for analytics

const firebaseConfig = {
  apiKey: "AIzaSyB8HRXKThDHvEDd9-tz-iORol4X21Pod0I",
  authDomain: "rentistan-fyp-react-native.firebaseapp.com",
  databaseURL: "https://rentistan-fyp-react-native-default-rtdb.firebaseio.com",
  projectId: "rentistan-fyp-react-native",
  storageBucket: "rentistan-fyp-react-native.appspot.com",
  messagingSenderId: "698955533443",
  appId: "1:698955533443:web:4f12344bd8f9c562471fb6",
  measurementId: "G-N6J0FEZF86"
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
