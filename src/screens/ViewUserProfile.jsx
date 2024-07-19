import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig'; // Adjust the import based on your project structure

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
        console.log(err);
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
      {/* Add more user details as needed */}
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
  error: {
    fontSize: 16,
    color: 'red',
  },
});

export default ViewUserProfile;
