import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';

const ReviewPayments = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  const user = FIREBASE_Auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    const q = query(collection(FIRESTORE_DB, 'payments'), where('recipientId', '==', userId), where('status', '==', 'pending'));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      try {
        const paymentsData = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const paymentData = docSnap.data();
          const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', paymentData.tenantId));
          return {
            id: docSnap.id,
            ...paymentData,
            tenantName: userDoc.exists() ? userDoc.data().name : 'Unknown',
          };
        }));
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching payments: ", error);
        setError("Failed to load payments.");
      }
    }, (error) => {
      console.error("Snapshot error: ", error);
      setError("Failed to load payments.");
    });

    return () => unsubscribe();
  }, [userId]);

  const handleConfirmPayment = async (paymentId) => {
    try {
      const paymentRef = doc(FIRESTORE_DB, 'payments', paymentId);
      await updateDoc(paymentRef, { status: 'confirmed' });
      console.log('Payment confirmed:', paymentId);

      // Refresh data to ensure the latest state
      const q = query(collection(FIRESTORE_DB, 'payments'), where('recipientId', '==', userId), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const paymentsData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error confirming payment: ", error);
      setError("Failed to confirm payment.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text style={styles.title}>Tenant: {item.tenantName}</Text>
            <Text>Amount: {item.amount}</Text>
            <Text>Transaction ID: {item.transactionId}</Text>
            {item.proofImage && <Image source={{ uri: item.proofImage }} style={styles.proofImage} />}
            <TouchableOpacity onPress={() => handleConfirmPayment(item.id)} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  paymentItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  proofImage: {
    width: 100,
    height: 100,
    marginTop: 8,
  },
  confirmButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#00ADEF',
    borderRadius: 4,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ReviewPayments;
