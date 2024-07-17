import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../../UserContext';

const AddRental = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [rooms, setRooms] = useState('');
  const [kitchen, setKitchen] = useState('');
  const [washroom, setWashroom] = useState('');
  const [size, setSize] = useState('');
  const [area, setArea] = useState('');
  const { user } = useContext(UserContext);

  const handleAddRental = async () => {
    if (title && images.length > 0 && price && description && rooms && kitchen && washroom && size && area) {
      const imageUrls = [];
      const storage = getStorage();

      for (const image of images) {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `rentals/${new Date().getTime()}_${image.filename}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      try {
        await addDoc(collection(FIRESTORE_DB, 'rentals'), {
          title,
          images: imageUrls,
          price,
          description,
          rooms,
          kitchen,
          washroom,
          size,
          area,
          postedBy: user?.name || 'Anonymous',
        });
        Alert.alert('Success', 'Rental listing added successfully!');
        navigation.goBack();
      } catch (error) {
        console.error('Error adding rental listing: ', error);
        Alert.alert('Error', 'Failed to add rental listing.');
      }
    } else {
      Alert.alert('Error', 'Please fill all fields.');
    }
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, allowsMultipleSelection: true });
      if (!pickerResult.cancelled && pickerResult.assets && pickerResult.assets.length > 0) {
        const selectedImages = pickerResult.assets.map(asset => ({ uri: asset.uri, filename: asset.fileName }));
        setImages([...images, ...selectedImages]);
      }
    } else {
      Alert.alert("Permission needed", "You need to grant permission to access the library.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.buttonText}>Upload Images</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Rooms"
        value={rooms}
        onChangeText={setRooms}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Kitchen"
        value={kitchen}
        onChangeText={setKitchen}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Washrooms"
        value={washroom}
        onChangeText={setWashroom}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Size (in sq. m)"
        value={size}
        onChangeText={setSize}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Area"
        value={area}
        onChangeText={setArea}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddRental}>
        <Text style={styles.buttonText}>Add Rental</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
  },
  uploadButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#00ADEF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddRental;
