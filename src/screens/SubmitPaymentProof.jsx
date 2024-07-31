import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';

const SubmitPaymentProof = ({ listingId }) => {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [error, setError] = useState('');

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProofImage(result.uri);
    }
  };

  const handleSubmitPayment = async () => {
    if (!amount || !transactionId || !proofImage) {
      setError('All fields are required');
      return;
    }

    const user = FIREBASE_Auth.currentUser;

    try {
      await addDoc(collection(FIRESTORE_DB, 'payments'), {
        tenantId: user.uid,
        listingId,
        amount: parseFloat(amount),
        transactionId,
        proofImage,
        status: 'pending',
        timestamp: serverTimestamp(),
      });
      alert('Payment proof submitted successfully');
    } catch (error) {
      console.error("Error submitting payment proof: ", error);
      setError("Failed to submit payment proof.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Transaction ID"
        value={transactionId}
        onChangeText={setTransactionId}
        style={styles.input}
      />
      <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
        {proofImage ? (
          <Image source={{ uri: proofImage }} style={styles.image} />
        ) : (
          <Text>Pick an Image</Text>
        )}
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Submit Payment" onPress={handleSubmitPayment} />
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
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default SubmitPaymentProof;
