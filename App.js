//App.js
import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { FIREBASE_Auth, FIRESTORE_DB } from './FirebaseConfig';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/Home';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ListingDetails from './src/screens/ListingDetails';
import MainChatScreen from './src/screens/MainChatScreen';
import ChatRoom from './src/screens/ChatRoom';
import UserProfile from './src/screens/UserProfile';
import ProfileScreen from './src/screens/UserProfile'; 
import EditProfileScreen from './src/screens/EditProfileScreen'; 
import AddRental from './src/screens/AddRental';
import EditListing from './src/screens/EditListing';
import FavoritesScreen from './src/screens/FavoritesScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpAndSupportScreen from './src/screens/HelpAndSupportScreen';
import ReviewsAndRatingsScreen from './src/screens/ReviewsAndRatingsScreen';
import { UserProvider, UserContext } from './UserContext';
import ViewUserProfile from './src/screens/ViewUserProfile';
import UserSelectionScreen from './src/screens/UserSelectionScreen';

// Import Notification Helpers
import { registerForPushNotificationsAsync, saveTokenToFirestore } from './src/consts/NotificationService';

// Notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="ListingDetails" component={ListingDetails} />
      <Stack.Screen name="EditListing" component={EditListing} />
      <Stack.Screen name="ChatRoom" component={ChatRoom}  />
      <Stack.Screen name="AddRental" component={AddRental} /> 
      <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />
      <Stack.Screen name="ViewUserProfile" component={ViewUserProfile} /> 
      <Stack.Screen name="UserSelectionScreen" component={UserSelectionScreen} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { user } = useContext(UserContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'HomeTab':
              iconName = 'home';
              break;
            case 'MainChatScreen':
              iconName = 'chat';
              break;
            case 'Notifications':
              iconName = 'notifications';
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
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={({ navigation }) => ({
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText}>Home</Text>
              <TouchableOpacity 
                style={styles.profileButton} 
                onPress={() => navigation.navigate('Profile')}
              >
                <Image
                  source={{ uri: user?.photoURL }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Tab.Screen name="MainChatScreen" component={MainChatScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Registration" 
        component={RegistrationScreen} 
        options={{ title: 'Register' }} 
      />
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ title: '' }} 
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfile} 
        options={{ title: 'Profile' }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
      <Stack.Screen 
        name="HelpAndSupport" 
        component={HelpAndSupportScreen} 
        options={{ title: 'Help and Support' }} 
      />
      <Stack.Screen 
        name="ReviewsAndRatings" 
        component={ReviewsAndRatingsScreen} 
        options={{ title: 'Reviews and Ratings' }} 
      />
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

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(notification));
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      unsubscribe();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [initializing]);

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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 'auto',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 10,
  },
});
