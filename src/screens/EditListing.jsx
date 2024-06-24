import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const EditListing = ({ route, navigation }) => {
  const { item } = route.params;
  const [title, setTitle] = useState(item.title);
  const [image, setImage] = useState(item.image); // State for image URL
  const [price, setPrice] = useState(item.price.toString());
  const [description, setDescription] = useState(item.description);

  const handleSavePress = async () => {
    try {
      await updateDoc(doc(FIRESTORE_DB, 'rentals', item.id), {
        title,
        price: parseFloat(price),
        description,
        image, // Include image in the update
      });
      Alert.alert('Success', 'Listing updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating listing: ', error);
      Alert.alert('Error', 'Failed to update listing.');
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
        multiline
      />
      
      <Button title="Save" onPress={handleSavePress} />
    </View>
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
});

export default EditListing;
