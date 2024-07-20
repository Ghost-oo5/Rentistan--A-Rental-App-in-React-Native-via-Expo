import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/Home';
import RegistrationScreen from './src/screens/RegistrationScreen';
import SearchResult from './src/screens/SearchResult';
import Filter from './src/screens/Filter';
import ListingDetails from './src/screens/ListingDetails';
import Checkout from './src/screens/Checkout';
import MainChatScreen from './src/screens/MainChatScreen';
import ChatRoom from './src/screens/ChatRoom';
import TenantFinder from './src/screens/TenantFinder';
import ListNewProperty from './src/screens/ListNewProperty';
import ListedProperties from './src/screens/ListedProperties';
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
import ViewUserProfile from './src/screens/ViewUserProfile'; // New ViewUserProfile screen
import UserSelectionScreen from './src/screens/UserSelectionScreen';

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
      <Stack.Screen name="SearchResult" component={SearchResult} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="ListingDetails" component={ListingDetails} />
      <Stack.Screen name="EditListing" component={EditListing} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} options={{ headerShown: false }} />
      <Stack.Screen name="TenantFinder" component={TenantFinder} />
      <Stack.Screen name="ListNewProperty" component={ListNewProperty} />
      <Stack.Screen name="ListedProperties" component={ListedProperties} />
      <Stack.Screen name="AddRental" component={AddRental} /> 
      <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />
      <Stack.Screen name="ViewUserProfile" component={ViewUserProfile} /> 
      <Stack.Screen name="UserSelectionScreen" component={UserSelectionScreen} />
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
            case 'Favorites':
              iconName = 'favorite';
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
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider> 
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserProvider> 
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
    width: 45,  // Increased width
    height: 45, // Increased height
    borderRadius: 25, // Adjusted for a circular image
    marginBottom: 10,
    marginTop: 10,
  },
});

