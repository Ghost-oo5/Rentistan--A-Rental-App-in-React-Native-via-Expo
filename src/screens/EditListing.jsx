import React, { useState } from 'react';
import { View, TextInput, ScrollView, Button, StyleSheet, Alert, Image, Text, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const EditListing = ({ route, navigation }) => {
  const { item } = route.params || {};
  const [title, setTitle] = useState(item?.title || '');
  const [images, setImages] = useState(item?.images || []); // Updated to handle multiple images
  const [price, setPrice] = useState(item?.price?.toString() || '');
  const [description, setDescription] = useState(item?.description || '');
  const [rooms, setRooms] = useState(item?.rooms?.toString() || '');
  const [kitchen, setKitchen] = useState(item?.kitchen?.toString() || '');
  const [washroom, setWashroom] = useState(item?.washroom?.toString() || '');
  const [size, setSize] = useState(item?.size?.toString() || '');
  const [area, setArea] = useState(item?.area || '');

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });
      if (!pickerResult.cancelled && pickerResult.assets && pickerResult.assets.length > 0) {
        const selectedImage = pickerResult.assets[0].uri;
        setImages([...images, selectedImage]);
      }
    } else {
      Alert.alert("Permission needed", "You need to grant permission to access the library.");
    }
  };

  const handleRemoveImage = (imageToRemove) => {
    setImages(images.filter(image => image !== imageToRemove));
  };

  const handleSavePress = async () => {
    let updatedImages = [...images]; // Keep existing images

    try {
      const updatedData = {
        title,
        price: parseFloat(price),
        description,
        rooms: parseInt(rooms),
        kitchen: parseInt(kitchen),
        washroom: parseInt(washroom),
        size: parseFloat(size),
        area,
        images: updatedImages,
      };

      await updateDoc(doc(FIRESTORE_DB, 'rentals', item.id), updatedData);
      Alert.alert('Success', 'Listing updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating listing: ', error);
      Alert.alert('Error', 'Failed to update listing.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />

        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => handleRemoveImage(image)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Text style={styles.buttonText}>Upload Images</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
        <TextInput style={styles.input} placeholder="Rooms" value={rooms} onChangeText={setRooms} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Kitchen" value={kitchen} onChangeText={setKitchen} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Washrooms" value={washroom} onChangeText={setWashroom} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Size (in sq. m)" value={size} onChangeText={setSize} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Area" value={area} onChangeText={setArea} />
        <TouchableOpacity style={styles.SaveButton} onPress={handleSavePress}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,

  },
  removeButtonText: {
    color: 'white',
  },
  uploadButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  SaveButton: {
    backgroundColor: '#00ADEF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditListing;
