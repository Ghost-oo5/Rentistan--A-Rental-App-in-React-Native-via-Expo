import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';

const AddReview = ({ listingId }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmitReview = async () => {
    if (!rating) {
      setError('Rating is required');
      return;
    }

    const user = FIREBASE_Auth.currentUser;

    try {
      await addDoc(collection(FIRESTORE_DB, 'reviews'), {
        listingId,
        tenantId: user.uid,
        rating: parseInt(rating),
        comment,
        timestamp: serverTimestamp(),
      });
      alert('Review submitted successfully');
    } catch (error) {
      console.error("Error submitting review: ", error);
      setError("Failed to submit review.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Comment"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Submit Review" onPress={handleSubmitReview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default AddReview;
