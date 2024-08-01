import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('screen');

const ReviewPaymentProof = ({ route }) => {
  const { requestId } = route.params;
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Add this line

  useEffect(() => {
    const fetchPaymentProofs = async () => {
      try {
        const bookingDocRef = doc(FIRESTORE_DB, 'bookingRequests', requestId);
        const bookingDoc = await getDoc(bookingDocRef);
        if (bookingDoc.exists()) {
          const data = bookingDoc.data();
          if (data.paymentProofs && Array.isArray(data.paymentProofs)) {
            setPaymentProofs(data.paymentProofs.map((proof, index) => ({
              url: proof,
              isLegit: false,
              id: index
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching payment proofs:', error);
        Alert.alert('Error', 'Failed to fetch payment proofs.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentProofs();
  }, [requestId]);

  const handleMarkAllAsLegit = async () => {
    const updatedProofs = paymentProofs.map(proof => ({
      ...proof,
      isLegit: true
    }));

    try {
      setLoading(true);
      const bookingDocRef = doc(FIRESTORE_DB, 'bookingRequests', requestId);
      await updateDoc(bookingDocRef, {
        paymentProofs: updatedProofs.map(proof => proof.url),
        legitProofs: updatedProofs.map(proof => proof.url)
      });
      setPaymentProofs(updatedProofs);
      Alert.alert('Success', 'All payment proofs marked as legit!');
      navigation.navigate('ManageBookings'); // Add this line to navigate
    } catch (error) {
      console.error('Error updating payment proofs:', error);
      Alert.alert('Error', 'Failed to update payment proofs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ADEF" />
      ) : (
        <ScrollView contentContainerStyle={styles.imagesContainer}>
          {paymentProofs.length > 0 ? (
            <View style={styles.swiperContainer}>
              <Swiper showsButtons={false} autoplay={false} loop={false}>
                {paymentProofs.map((proof, index) => (
                  <View key={index} style={styles.imagePreviewContainer}>
                    <Image source={{ uri: proof.url }} style={styles.imagePreview} />
                  </View>
                ))}
              </Swiper>
            </View>
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>No Payment Proofs Available</Text>
            </View>
          )}
          <TouchableOpacity style={styles.markAllLegitButton} onPress={handleMarkAllAsLegit}>
            <Text style={styles.buttonText}>Mark All as Legit</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  imagesContainer: {
    alignItems: 'center',
  },
  swiperContainer: {
    width: width * 0.9,
    height: width * 0.9 * 0.75,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreviewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
  },
  markAllLegitButton: {
    backgroundColor: '#00ADEF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ReviewPaymentProof;
