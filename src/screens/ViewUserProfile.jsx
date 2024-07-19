import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

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

    console.log('Fetching details for userId:', userId);

    const fetchUserDetails = async () => {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // console.log('User data:', userDoc.data());
          setUserDetails(userDoc.data());
        } else {
          console.log('User not found for userId:', userId);
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
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

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{userDetails.name}</Text>
      <Text style={styles.email}>{userDetails.email}</Text>
      <Text style={styles.address}>{userDetails.address}</Text>
      <Text style={styles.contactNumber}>{userDetails.contactNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    color: '#666',
  },
  address: {
    fontSize: 18,
    color: '#666',
  },
  contactNumber: {
    fontSize: 18,
    color: '#666',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
});

export default ViewUserProfile;
