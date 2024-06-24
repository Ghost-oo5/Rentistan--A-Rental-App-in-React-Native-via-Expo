import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddRental = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleAddRental = async () => {
    if (title && image && price && description) {
      try {
        await addDoc(collection(FIRESTORE_DB, 'rentals'), {
          title,
          image,
          price,
          description,
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
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
      <Button title="Add Rental" onPress={handleAddRental} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default AddRental;
