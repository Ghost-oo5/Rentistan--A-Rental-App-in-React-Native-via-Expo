// MainTabs.js

import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './src/screens/Home';
import MainChatScreen from './src/screens/MainChatScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import FavoritesScreen from './src/screens/FavoriteScreen';
import BookingManagement from './src/screens/ManageBookings'; // Add Manage Bookings screen
import ManageListings from './src/screens/ManageListings'; // Add Manage Bookings screen
import RenterDashboard from './src/screens/RenterDashboard'; // Same as HomeScreen for tenants
import ListingDetails from './src/screens/ListingDetails';
import { UserContext } from './UserContext';
import Header from './src/consts/Header';
import Home from './src/screens/Home';
import * as Notifications from 'expo-notifications'; // Import Notifications from expo-notifications

const Tab = createBottomTabNavigator();

function RenterTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Chat':
              iconName = 'chat';
              break;
            case 'Notifications':
              iconName = 'notifications';
              break;
            case 'Favorites':
              iconName = 'favorite';
              break;
            default:
              iconName = 'home';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00ADEF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={RenterDashboard} options={{ header: () => <Header /> }} />
      <Tab.Screen name="Chat" component={MainChatScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="ListingDetails" component={ListingDetails} />
    </Tab.Navigator>
  );
}

function TenantTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Chat':
              iconName = 'chat';
              break;
            case 'Favorites':
              iconName = 'favorite';
              break;
            case 'ManageBookings':
              iconName = 'event';
              break;
            default:
              iconName = 'home';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00ADEF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ header: () => <Header /> }} />
      <Tab.Screen name="Chat" component={MainChatScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="ManageBookings" component={BookingManagement} />
    </Tab.Navigator>
  );
}

function MainTabs() {
  const { profileType } = useContext(UserContext);

  return profileType === 'tenant' ? <TenantTabs /> : <RenterTabs />;
}

export default MainTabs;
