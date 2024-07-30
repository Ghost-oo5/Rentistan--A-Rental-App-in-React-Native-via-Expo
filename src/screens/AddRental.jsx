// src/screens/AddRental.jsx
import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, ScrollView, TouchableOpacity, Text, Modal } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Import Timestamp
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../../UserContext';
import * as Notifications from 'expo-notifications';

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
  const [availability, setAvailability] = useState('Available'); // Set default availability
  const [modalVisible, setModalVisible] = useState(false);
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
        const rentalData = {
          title,
          images: imageUrls,
          price,
          description,
          rooms,
          kitchen,
          washroom,
          size,
          area,
          availability, // Add availability to the rental data
          postedBy: user?.id || 'Anonymous',
          postedByName: user?.name || 'Anonymous', // Include the user's name here
          timestamp: Timestamp.now() // Add timestamp to the rental data
        };

        // Add the rental listing to Firestore
        await addDoc(collection(FIRESTORE_DB, 'rentals'), rentalData);

        // Trigger notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'New Listing Added',
            body: `A new listing has been added: ${title}`,
          },
          trigger: null,
        });

        Alert.alert('Success', 'Rental listing added successfully!');
        console.log('Success', 'Rental listing added successfully!');
        alert('Success', 'Rental listing added successfully!');
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

      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerText}>{availability}</Text> 
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalItem} onPress={() => { setAvailability('Available'); setModalVisible(false); }}>
              <Text style={styles.modalItemText}>Available</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => { setAvailability('Rented'); setModalVisible(false); }}>
              <Text style={styles.modalItemText}>Rented</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  pickerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default AddRental;
