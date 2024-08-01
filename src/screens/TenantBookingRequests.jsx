import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';

const TenantBookingRequests = ({ navigation }) => {
  const [tenantBookingRequests, setTenantBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const auth = FIREBASE_Auth;
  const user = auth.currentUser;
  const senderId = user?.uid;

  useEffect(() => {
    if (!senderId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const q = query(
      collection(FIRESTORE_DB, 'bookingRequests'),
      where('requesterId', '==', senderId)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      try {
        const fetchedRequests = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const requestData = docSnap.data();
          const receiverDoc = await getDoc(doc(FIRESTORE_DB, 'users', requestData.recipientId));
          return {
            id: docSnap.id,
            ...requestData,
            receiverName: receiverDoc.exists() ? receiverDoc.data().name : 'Unknown',
          };
        }));
        setTenantBookingRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching booking requests: ", error);
        setError("Failed to load booking requests.");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Snapshot error: ", error);
      setError("Failed to load booking requests.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [senderId]);

  const handleSubmitPaymentProof = (requestId) => {
    navigation.navigate('SubmitPaymentProof', { requestId, onPaymentProofReviewed: refreshRequests });
  };

  const handleAddReview = (requestId) => {
    navigation.navigate('AddReview', { requestId });
  };

  const refreshRequests = async () => {
    try {
      const q = query(collection(FIRESTORE_DB, 'bookingRequests'), where('requesterId', '==', senderId));
      const querySnapshot = await getDocs(q);
      const requests = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const requestData = docSnap.data();
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', requestData.recipientId));
        return {
          id: docSnap.id,
          ...requestData,
          receiverName: userDoc.exists() ? userDoc.data().name : 'Unknown',
        };
      }));
      setTenantBookingRequests(requests);
    } catch (error) {
      console.error("Error refreshing booking requests: ", error);
      setError("Failed to refresh booking requests.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text style={styles.receiverName}>{`Receiver: ${item.receiverName}`}</Text>
      <Text style={styles.messageText}>{`Message: ${item.message}`}</Text>
      <Text style={styles.statusText}>{`Status: ${item.status}`}</Text>
      {item.createdAt && (
        <Text style={styles.dateText}>{`Sent on: ${item.createdAt.toDate().toLocaleDateString()}`}</Text>
      )}
      {item.status === 'accepted' && (
        <TouchableOpacity
          style={styles.paymentProofButton}
          onPress={() => item.legitProofs ? handleAddReview(item.id) : handleSubmitPaymentProof(item.id)}
        >
          <Text style={styles.buttonText}>{item.legitProofs ? 'Add Review' : 'Submit Payment Proof'}</Text>
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
        data={tenantBookingRequests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.requestList}
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
  requestList: {
    flex: 1,
  },
  requestContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  receiverName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#00ADEF',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
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
  },
});

export default TenantBookingRequests;
