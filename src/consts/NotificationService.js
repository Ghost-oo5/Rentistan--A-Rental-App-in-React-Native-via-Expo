// src/consts/NotificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { FIREBASE_Auth, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      console.log('Notification channel set up for Android');
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission not granted');
        console.log('Permission not granted');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        Alert.alert('Project ID not found');
        console.log('Project ID not found');
        return;
      }
      try {
        const pushToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Push token obtained:', pushToken);
        return pushToken;
      } catch (e) {
        Alert.alert(`Error: ${e}`);
        console.log('Error obtaining push token:', e);
      }
    } else {
      Alert.alert('Must use physical device for push notifications');
      console.log('Must use physical device for push notifications');
    }
  } catch (error) {
    console.log('Error in registerForPushNotificationsAsync:', error);
  }
}

export async function saveTokenToFirestore(token) {
  try {
    const userId = FIREBASE_Auth.currentUser?.uid;
    if (userId) {
      const userDocRef = doc(FIRESTORE_DB, 'users', userId);
      await updateDoc(userDocRef, {
        expoPushToken: token,
      });
      console.log('Push token saved to Firestore');
    } else {
      console.log('No user ID found');
    }
  } catch (error) {
    console.log('Error saving token to Firestore:', error);
  }
}
