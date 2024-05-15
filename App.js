// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen'; // Adjust the path to WelcomeScreen
import LoginForm from './src/screens/loginform'; // Adjust the path to LoginForm
import Home from './src/screens/Home';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyCsTEeEMLQlKJxsGTaZUA6RbS3ebfMG7c0",
  authDomain: "rentistan-react-native-app.firebaseapp.com",
  projectId: "rentistan-react-native-app",
  storageBucket: "rentistan-react-native-app.appspot.com",
  messagingSenderId: "555430383847",
  appId: "1:555430383847:web:dff9b7e3d074e975e8d242",
  measurementId: "G-CD040CLPW6"
};
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LoginForm" component={LoginForm} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


