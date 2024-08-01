import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, getDocs, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';

const ManageBookings = ({ navigation }) => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const user = FIREBASE_Auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const q = query(collection(FIRESTORE_DB, 'bookingRequests'), where('recipientId', '==', userId));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      try {
        const requests = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const requestData = docSnap.data();
          const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', requestData.requesterId));
          return {
            id: docSnap.id,
            ...requestData,
            requesterName: userDoc.exists() ? userDoc.data().name : 'Unknown',
          };
        }));
        setBookingRequests(requests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking requests: ", error);
        setError("Failed to load booking requests.");
        setLoading(false);
      }
    }, (error) => {
      console.error("Snapshot error: ", error);
      setError("Failed to load booking requests.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleResponse = async (requestId, status) => {
    try {
      const requestRef = doc(FIRESTORE_DB, 'bookingRequests', requestId);

      if (status === 'rejected') {
        await deleteDoc(requestRef);
        console.log('Booking request rejected:', requestId);
      } else if (status === 'accepted') {
        await updateDoc(requestRef, { status });
        console.log('Booking request accepted:', requestId);
      }

      // Refresh data to ensure the latest state
      const q = query(collection(FIRESTORE_DB, 'bookingRequests'), where('recipientId', '==', userId));
      const querySnapshot = await getDocs(q);
      const requests = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const requestData = docSnap.data();
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', requestData.requesterId));
        return {
          id: docSnap.id,
          ...requestData,
          requesterName: userDoc.exists() ? userDoc.data().name : 'Unknown',
        };
      }));
      setBookingRequests(requests);

      alert(status === 'accepted' ? 'Booking request accepted' : 'Booking request rejected');

    } catch (error) {
      console.error("Error handling booking request: ", error);
      setError("Failed to handle booking request.");
    }
  };

  const handleViewUserProfile = (userId) => {
    console.log('Navigating to ViewUserProfile with userId:', userId);
    navigation.navigate('ViewUserProfile', { userId });
  };

  const handleSubmitPaymentProof = (requestId) => {
    navigation.navigate('ReviewPaymentProof', { requestId, onPaymentProofReviewed: refreshRequests });
  };

  const handleAddReview = (requestId) => {
    navigation.navigate('AddReview', { requestId });
  };

  const refreshRequests = async () => {
    try {
      const q = query(collection(FIRESTORE_DB, 'bookingRequests'), where('recipientId', '==', userId));
      const querySnapshot = await getDocs(q);
      const requests = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const requestData = docSnap.data();
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', requestData.requesterId));
        return {
          id: docSnap.id,
          ...requestData,
          requesterName: userDoc.exists() ? userDoc.data().name : 'Unknown',
        };
      }));
      setBookingRequests(requests);
    } catch (error) {
      console.error("Error refreshing booking requests: ", error);
      setError("Failed to refresh booking requests.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <TouchableOpacity onPress={() => handleViewUserProfile(item.requesterId)}>
        <Text style={styles.requesterText}>Requester: {item.requesterName}</Text>
      </TouchableOpacity>
      <Text style={styles.messageText}>Message: {item.message}</Text>
      <Text style={styles.statusText}>Status: {item.status}</Text>
      {item.status === 'pending' && (
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
      )}
      {item.status === 'accepted' && (
        <TouchableOpacity
          style={styles.paymentProofButton}
          onPress={() => item.legitProofs ? handleAddReview(item.id) : handleSubmitPaymentProof(item.id)}
        >
          <Text style={styles.buttonText}>{item.legitProofs ? 'Add Review' : 'Payment Proof'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00ADEF" />
      </SafeAreaView>
    );
  }

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
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  requestContainer: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  requesterText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#00ADEF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  paymentProofButton: {
    backgroundColor: '#00ADEF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ManageBookings;
