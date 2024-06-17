import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WelcomeScreen from './src/screens/WelcomeScreen';
import Home from './src/screens/Home';
import RegistrationScreen from './src/screens/RegistrationScreen';
import SearchResult from './src/screens/SearchResult';
import Filter from './src/screens/Filter';
import ListingDetails from './src/screens/ListingDetails';
import Checkout from './src/screens/Checkout';
import Chats from './src/screens/Chats';
import ChatRoom from './src/screens/ChatRoom';
import TenantFinder from './src/screens/TenantFinder';
import ListNewProperty from './src/screens/ListNewProperty';
import ListedProperties from './src/screens/ListedProperties';
import UserDashboard from './src/screens/UserDashboard';
import UserProfile from './src/screens/UserProfile';
import AppNavigator from './AppNavigator'; // Import your AppNavigator

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppNavigator">
        <Stack.Screen name="AppNavigator" component={AppNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
