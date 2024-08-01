import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';
import StarRating from 'react-native-star-rating-widget';

const AddReview = ({ recipientId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setError('Rating is required');
      return;
    }

    if (!recipientId) {
      setError('Recipient ID is missing');
      return;
    }

    const user = FIREBASE_Auth.currentUser;

    if (!user) {
      setError('User is not authenticated');
      return;
    }

    try {
      // Create references for both recipient and requester profiles
      const recipientDocRef = doc(FIRESTORE_DB, 'users', recipientId);
      const requesterDocRef = doc(FIRESTORE_DB, 'users', user.uid);

      // Get the recipient's document to ensure it exists
      const recipientDoc = await recipientDocRef.get();
      if (!recipientDoc.exists()) {
        setError('Recipient document not found');
        return;
      }

      // Add the review to the recipient's profile
      await updateDoc(recipientDocRef, {
        reviews: arrayUnion({
          tenantId: user.uid,
          rating,
          comment,
          timestamp: serverTimestamp(),
        }),
      });

      // Optionally, add a reference to the review in the requester's profile for tracking
      await updateDoc(requesterDocRef, {
        givenReviews: arrayUnion({
          recipientId,
          rating,
          comment,
          timestamp: serverTimestamp(),
        }),
      });

      alert('Review submitted successfully');
      setRating(0);
      setComment('');
    } catch (error) {
      console.error("Error submitting review: ", error);
      setError("Failed to submit review.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate and Review</Text>
      <StarRating
        rating={rating}
        onChange={setRating}
        color="#ffd700"
        starSize={30}
        style={styles.starRating}
      />
      <TextInput
        placeholder="Write your comment here"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  starRating: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#00ADEF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddReview;
