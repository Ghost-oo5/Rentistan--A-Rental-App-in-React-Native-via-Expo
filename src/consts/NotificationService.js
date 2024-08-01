  import * as Notifications from 'expo-notifications';
  import * as Device from 'expo-device';
  import Constants from 'expo-constants';
  import { Alert, Platform } from 'react-native';
  import { FIREBASE_Auth, FIRESTORE_DB } from '../../FirebaseConfig';
  import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';

  // Set up notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
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
        const userDocRef = doc(FIRESTORE_DB, 'pushTokens', userId);
        await setDoc(userDocRef, {
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

  export async function sendNotificationToAllUsers(title, body) {
    try {
      const pushTokensCollection = collection(FIRESTORE_DB, 'pushTokens');
      const pushTokensSnapshot = await getDocs(pushTokensCollection);

      if (pushTokensSnapshot.empty) {
        console.log('No push tokens found in Firestore.');
        return;
      }

      pushTokensSnapshot.forEach(async (doc) => {
        const token = doc.data().expoPushToken;
        if (token) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: title,
              body: body,
            },
            trigger: null,
            to: token, // Add this line to specify the recipient's token
          });
          console.log('Notification sent to:', token);
        }
      });
    } catch (error) {
      console.log('Error sending notification to all users:', error);
    }
  }
  export async function sendNotificationToUser(userId, title, body) {
    try {
      const pushTokenDoc = doc(FIRESTORE_DB, 'pushTokens', userId);
      const pushTokenSnap = await getDoc(pushTokenDoc);
      if (pushTokenSnap.exists()) {
        const token = pushTokenSnap.data().expoPushToken;
        if (token) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: title,
              body: body,
            },
            trigger: null,
            to: token,
          });
          console.log('Notification sent to:', token);
        }
      }
    } catch (error) {
      console.log('Error sending notification:', error);
    }
  }
  
  export async function saveNotificationToFirestore(type, message, userId, additionalData) {
    // Extract values if 'type' is an object
    if (typeof type === 'object') {
      message = type.message;
      userId = type.userId;
      type = type.type;
    }
  
    // Validate input
    if (!type || !message || !userId) {
      console.error('Invalid input parameters:', { type, message, userId, additionalData });
      return;
    }
  
    // Fetch username from Firestore
    let username;
    try {
      const userDocRef = doc(FIRESTORE_DB, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        username = userDoc.data().name || userId; // Fallback to userId if name is not found
      } else {
        username = userId; // Fallback to userId if user document is not found
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      username = userId; // Fallback to userId if there’s an error fetching username
    }
  
    // Format the message based on the type
    let formattedMessage;
    let heading;
  
    switch (type) {
      case 'message':
        heading = 'New Message';
        formattedMessage = `From: ${username}\n${message}`;
        break;
      case 'listing':
        heading = 'New Listing Notification';
        formattedMessage = message;
        break;
      default:
        heading = 'Notification';
        formattedMessage = message; // Default case if type is not recognized
        break;
    }
  
    try {
      const notificationRef = collection(FIRESTORE_DB, 'notifications');
      const docRef = await addDoc(notificationRef, {
        type: type,
        message: formattedMessage,
        heading: heading,
        timestamp: new Date(),
        userId: userId,
        additionalData: additionalData || {},  // Default to empty object if undefined
      });
      console.log('Notification saved to Firestore with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving notification to Firestore:', error);
    }
  }


