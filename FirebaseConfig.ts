import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth';

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
let FIREBASE_Auth;
let FIRESTORE_DB;
let FIREBASE_STORAGE;

if (!getApps().length) {
  FIREBASE_APP = initializeApp(firebaseConfig);

  if (Platform.OS !== 'web') {
    FIREBASE_Auth = initializeAuth(FIREBASE_APP, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } else {
    FIREBASE_Auth = getAuth(FIREBASE_APP);
  }

  FIRESTORE_DB = getFirestore(FIREBASE_APP);
  FIREBASE_STORAGE = getStorage(FIREBASE_APP);
} else {
  FIREBASE_APP = getApp();
  FIREBASE_Auth = getAuth(FIREBASE_APP);
  FIRESTORE_DB = getFirestore(FIREBASE_APP);
  FIREBASE_STORAGE = getStorage(FIREBASE_APP);
}

export { FIREBASE_APP, FIREBASE_Auth, FIRESTORE_DB, FIREBASE_STORAGE };
