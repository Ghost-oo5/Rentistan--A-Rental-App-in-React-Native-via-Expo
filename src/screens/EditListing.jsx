import React, { useState } from 'react';
import { View, TextInput, ScrollView, Button, StyleSheet, Alert, Image } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const EditListing = ({ route, navigation }) => {
  const { item } = route.params || {};
  const [title, setTitle] = useState(item?.title || '');
  const [image, setImage] = useState(item?.image || '');
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
        setImage(selectedImage);
      }
    } else {
      Alert.alert("Permission needed", "You need to grant permission to access the library.");
    }
  };

  const handleSavePress = async () => {
    let imageUrl = image;

    if (image && image !== item.image) {
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, `images/${item.id}`);

        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
        console.log('Uploaded Image URL:', imageUrl);
      } catch (error) {
        console.error('Error uploading image: ', error);
        Alert.alert('Error', 'Failed to upload image.');
        return;
      }
    }

    const dataToUpdate = {
      title,
      price: parseFloat(price),
      description,
      rooms: parseInt(rooms),
      kitchen: parseInt(kitchen),
      washroom: parseInt(washroom),
      size: parseFloat(size),
      area,
    };

    if (imageUrl && imageUrl !== item.image) {
      dataToUpdate.image = imageUrl;
    }

    try {
      await updateDoc(doc(FIRESTORE_DB, 'rentals', item.id), dataToUpdate);
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
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <Button title="Upload Image" onPress={handleImageUpload} />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Rooms" value={rooms} onChangeText={setRooms} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Kitchen" value={kitchen} onChangeText={setKitchen} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Washrooms" value={washroom} onChangeText={setWashroom} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Size (in sq. m)" value={size} onChangeText={setSize} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Area" value={area} onChangeText={setArea} />
      <Button title="Save" onPress={handleSavePress} />
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
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default EditListing;
