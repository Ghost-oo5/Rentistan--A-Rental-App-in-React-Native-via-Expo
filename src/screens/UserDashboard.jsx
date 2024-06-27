import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { ListItem, Icon, Text } from 'react-native-elements';

const UserDashboard = ({ navigation }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIRESTORE_DB, 'rentals'), (snapshot) => {
      const listingsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListings(listingsList);
    }, (error) => {
      console.error('Error fetching listings: ', error);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteListing = async (id) => {
    try {
      await deleteDoc(doc(FIRESTORE_DB, 'rentals', id));
      Alert.alert('Success', 'Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing: ', error);
      Alert.alert('Error', 'Failed to delete listing.');
    }
  };

  const handleModifyListing = (item) => {
    console.log('Edit Listing pressed');
    navigation.navigate('EditListing', { item });
  };

  const handleAddListing = () => {
    console.log('Add Listing pressed');
    navigation.navigate('AddRental');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <Image source={{ uri: item.image }} style={styles.image} />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
              <ListItem.Subtitle>${item.price} / month</ListItem.Subtitle>
              <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
            </ListItem.Content>
            <TouchableOpacity onPress={() => handleDeleteListing(item.id)}>
              <Icon name="delete" color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleModifyListing(item)}>
              <Icon name="edit" color="#00ADEF" />
            </TouchableOpacity>
          </ListItem>
        )}
      />
      <Icon
        raised
        reverse
        name="add"
        type="material"
        color="#00ADEF"
        onPress={handleAddListing}
        containerStyle={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default UserDashboard;
