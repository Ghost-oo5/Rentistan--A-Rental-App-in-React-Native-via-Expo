// App.js

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './UserContext';
import MainTabs from './MainTabs'; // Import updated MainTabs component
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import UserProfile from './src/screens/UserProfile';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpAndSupportScreen from './src/screens/HelpAndSupportScreen';
import ReviewsAndRatingsScreen from './src/screens/ReviewsAndRatingsScreen';
import NotificationScreen from './src/screens/NotificationsScreen';
import { FIREBASE_Auth } from './FirebaseConfig';
import { registerForPushNotificationsAsync, saveTokenToFirestore, saveNotificationToFirestore } from './src/consts/NotificationService';
import * as Notifications from 'expo-notifications'; // Import Notifications from expo-notifications
import ListingDetails from './src/screens/ListingDetails';
import ViewUserProfile from './src/screens/ViewUserProfile';
import AddRental from './src/screens/AddRental';
import ManageListings from './src/screens/ManageListings'; // Add Manage Bookings screen
import EditListing from './src/screens/EditListing';
import FavoriteScreen from './src/screens/FavoriteScreen';
import TenantProfile from './src/screens/TenantProfile';
import ChatRoom from './src/screens/ChatRoom';
import UserSelectionScreen from './src/screens/UserSelectionScreen';
import ManageBookings from './src/screens/ManageBookings';
import PaymentHistory from './src/screens/PaymentHistory';
import SubmitPaymentProof from './src/screens/SubmitPaymentProof';
import TenantBookingRequests from './src/screens/TenantBookingRequests';
import ReviewPaymentProof from './src/screens/ReviewPaymentProof';
import AddReview from './src/screens/AddReview';

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Registration" component={RegistrationScreen} options={{ title: 'Register' }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ title: '' }} />
      <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'Profile' }} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="HelpAndSupportScreen" component={HelpAndSupportScreen} options={{ title: 'Help and Support' }} />
      <Stack.Screen name="ReviewsAndRatingsScreen" component={ReviewsAndRatingsScreen} options={{ title: 'Reviews and Ratings' }} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="ListingDetails" component={ListingDetails} options={{ title: 'Listing Details' }} />
      <Stack.Screen name="ViewUserProfile" component={ViewUserProfile} options={{ title: 'ViewUserProfile' }} />
      <Stack.Screen name="AddRental" component={AddRental} options={{ title: 'AddRental' }} />
      <Stack.Screen name="ManageListings" component={ManageListings} options={{ title: 'ManageListings' }} />
      <Stack.Screen name="EditListing" component={EditListing} options={{ title: 'EditListing' }} />
      <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} options={{ title: 'FavoriteScreen' }} />
      <Stack.Screen name="TenantProfile" component={TenantProfile} options={{ title: 'TenantProfile' }} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} options={{ title: 'ChatRoom' }} />
      <Stack.Screen name="UserSelectionScreen" component={UserSelectionScreen} options={{ title: 'UserSelectionScreen' }} />
      <Stack.Screen name="ManageBookings" component={ManageBookings} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
      <Stack.Screen name="SubmitPaymentProof" component={SubmitPaymentProof} />
      <Stack.Screen name="TenantBookingRequests" component={TenantBookingRequests} />
      <Stack.Screen name="ReviewPaymentProof" component={ReviewPaymentProof} />
      <Stack.Screen name="AddReview" component={AddReview} />

    </Stack.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const unsubscribe = FIREBASE_Auth.onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    registerForPushNotificationsAsync().then(token => {
      if (token) {
        saveTokenToFirestore(token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(async notification => {
      const { title, body } = notification.request.content;
      if (user) {
        await saveNotificationToFirestore({
          type: 'message',
          message: body,
          userId: user.uid,
          additionalData: {
            title,
            ...notification.request.content.data,
          },
        });
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      console.log("this is notification error ", response.error);
    });

    return () => {
      unsubscribe();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [initializing, user]);

  if (initializing) return null;

  return (
    <UserProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  // Your styles here
});
