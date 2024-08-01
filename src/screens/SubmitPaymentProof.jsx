import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

const SubmitPaymentProof = ({ route }) => {
  const { requestId } = route.params; // Access requestId from navigation params
  const [imageUris, setImageUris] = useState([]);
  const [existingProofs, setExistingProofs] = useState([]);
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  useEffect(() => {
    const fetchExistingProofs = async () => {
      try {
        const bookingDocRef = doc(FIRESTORE_DB, 'bookingRequests', requestId);
        const bookingDoc = await getDoc(bookingDocRef);
        if (bookingDoc.exists()) {
          const data = bookingDoc.data();
          if (data.paymentProofs && Array.isArray(data.paymentProofs)) {
            setExistingProofs(data.paymentProofs);
          }
        }
      } catch (error) {
        console.error('Error fetching existing proofs:', error);
        Alert.alert('Error', 'Failed to fetch existing payment proofs.');
      }
    };

    fetchExistingProofs();
  }, [requestId]);

  const getBlobFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImage = async (uri) => {
    try {
      const blob = await getBlobFromUri(uri);
      const storageRef = ref(storage, `paymentProofs/${requestId}/${new Date().toISOString()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error during image upload:', error);
      throw error;
    }
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You've refused to allow this app to access your photos!");
        return;
      }
  
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      if (!pickerResult.cancelled && pickerResult.assets.length > 0) {
        // Create a set to avoid duplicates
        const newUris = pickerResult.assets.map(asset => asset.uri);
        setImageUris(prevUris => {
          const uriSet = new Set(prevUris);
          newUris.forEach(uri => uriSet.add(uri));
          return Array.from(uriSet);
        });
      }
    } catch (error) {
      console.error('Error during image picking:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };
  

  const handleSubmit = async () => {
    if (imageUris.length === 0) {
      Alert.alert('Error', 'Please select images first.');
      return;
    }
  
    setLoading(true);
    try {
      const imageUrls = await Promise.all(imageUris.map(uploadImage));
      await updatePaymentProof(imageUrls);
      setImageUris([]); // Clear image URIs after successful upload
    } catch (error) {
      console.error('Error during image upload:', error);
      Alert.alert('Error', 'Failed to upload images.');
    } finally {
      setLoading(false);
    }
  };
  

  const updatePaymentProof = async (imageUrls) => {
    try {
      const bookingDocRef = doc(FIRESTORE_DB, 'bookingRequests', requestId);
      const bookingDoc = await getDoc(bookingDocRef);
      const existingProofs = bookingDoc.exists() ? bookingDoc.data().paymentProofs || [] : [];
      await updateDoc(bookingDocRef, { paymentProofs: [...existingProofs, ...imageUrls] });
      Alert.alert('Success', 'Payment proofs submitted successfully!');
      setExistingProofs([...existingProofs, ...imageUrls]); // Update state with newly added URLs
    } catch (error) {
      console.error('Error updating payment proof:', error);
      Alert.alert('Error', `Failed to update payment proof: ${error.message}`);
    }
  };

  const handleDeleteImage = (uri) => {
    setImageUris(prevUris => prevUris.filter(existingUri => existingUri !== uri));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.buttonText}>Pick Images</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.imagesContainer}>
        {existingProofs.map((uri, index) => (
          <View key={`existing-${index}`} style={styles.imagePreviewContainer}>
            <Image source={{ uri }} style={styles.imagePreview} />
          </View>
        ))}
        {imageUris.map((uri, index) => (
          <View key={`new-${index}`} style={styles.imagePreviewContainer}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(uri)}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Payment Proofs</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#00ADEF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButton: {
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
  imagesContainer: {
    alignItems: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'visible', // Temporarily set to visible to check if button is clipped
  },
  imagePreview: {
    width: 200,
    height: 200,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF5722',
    borderRadius: 20,
    padding: 8, // Increased padding for better visibility
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20, // Increased font size for better visibility
  },
});

export default SubmitPaymentProof;
