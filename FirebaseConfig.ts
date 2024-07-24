import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore methods
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics'; // Import for analytics

const firebaseConfig = {
  apiKey: "AIzaSyCsTEeEMLQlKJxsGTaZUA6RbS3ebfMG7c0",
  authDomain: "rentistan-react-native-app.firebaseapp.com",
  projectId: "rentistan-react-native-app",
  storageBucket: "rentistan-react-native-app.appspot.com",
  messagingSenderId: "555430383847",
  appId: "1:555430383847:web:dff9b7e3d074e975e8d242",
  measurementId: "G-CD040CLPW6"
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
