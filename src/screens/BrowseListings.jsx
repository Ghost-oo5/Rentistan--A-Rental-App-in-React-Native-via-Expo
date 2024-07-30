import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const listings = [
  // Sample data
  { id: '1', title: 'Cozy Apartment' },
  { id: '2', title: 'Modern Studio' },
  { id: '3', title: 'Spacious House' },
];

const BrowseListings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Listings</Text>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listing}
            onPress={() => navigation.navigate('ListingDetails', { id: item.id })}
          >
            <Text style={styles.listingTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  listing: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
  },
  listingTitle: {
    fontSize: 18,
  },
});

export default BrowseListings;
