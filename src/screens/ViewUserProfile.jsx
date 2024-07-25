// src/screens/ViewUserProfile.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const ViewUserProfile = () => {
  const route = useRoute();
  const { userId } = route.params;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Error fetching user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ADEF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${userDetails.contactNumber}`);
  };

  const handleMessage = () => {
    Linking.openURL(`sms:${userDetails.contactNumber}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${userDetails.whatsappNumber}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${userDetails.email}`);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.profileImage} source={{ uri: userDetails.photoURL }} />
      <Text style={styles.name}>{userDetails.name}</Text>

      <View style={styles.infoContainer}>
        <FontAwesome name="envelope" size={24} color="#00ADEF" />
        <Text style={styles.infoText}>{userDetails.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="phone" size={24} color="#00ADEF" />
        <Text style={styles.infoText}>{userDetails.contactNumber}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="whatsapp" size={24} color="#25D366" />
        <Text style={styles.infoText}>{userDetails.whatsappNumber}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="home" size={24} color="#00ADEF" />
        <Text style={styles.infoText}>{userDetails.address}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.callButton]} onPress={handleCall}>
          <MaterialIcons name="call" size={24} color="#fff" />
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.messageButton]} onPress={handleMessage}>
          <MaterialIcons name="message" size={24} color="#fff" />
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.whatsappButton]} onPress={handleWhatsApp}>
          <FontAwesome name="whatsapp" size={24} color="#fff" />
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={handleEmail}>
          <FontAwesome name="envelope" size={24} color="#fff" />
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 10,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
    flex: 1,
  },
 
  callButton: {
    backgroundColor: '#00ADEF',
  },
  messageButton: {
    backgroundColor: '#4CAF50',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  emailButton: {
    backgroundColor: '#FF5722',
  },
});

export default ViewUserProfile;