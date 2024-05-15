// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_Auth = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
