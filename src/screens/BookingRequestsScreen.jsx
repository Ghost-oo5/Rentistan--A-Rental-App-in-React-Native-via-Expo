import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const BookingRequestsScreen = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [error, setError] = useState('');

  const user = FIREBASE_Auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    const q = query(collection(FIRESTORE_DB, 'bookingRequests'), where('recipientId', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const requests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookingRequests(requests);
      } catch (error) {
        console.error("Error fetching booking requests: ", error);
        setError("Failed to load booking requests.");
      }
    }, (error) => {
      console.error("Snapshot error: ", error);
      setError("Failed to load booking requests.");
    });

    return () => unsubscribe();
  }, [userId]);

  const handleResponse = async (requestId, status) => {
    try {
      const requestRef = doc(FIRESTORE_DB, 'bookingRequests', requestId);
      await updateDoc(requestRef, { status });
      alert(`Booking request ${status}`);
    } catch (error) {
      console.error("Error updating booking request: ", error);
      setError("Failed to update booking request.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text>Requester ID: {item.requesterId}</Text>
      <Text>Status: {item.status}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleResponse(item.id, 'accepted')}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleResponse(item.id, 'rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookingRequests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  requestContainer: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  acceptButton: {
    backgroundColor: '#00ADEF',
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default BookingRequestsScreen;
