import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const bookings = [
  // Sample data
  { id: '1', property: 'Cozy Apartment', status: 'Confirmed' },
  { id: '2', property: 'Modern Studio', status: 'Pending' },
];

const BookingManagement = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Management</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.booking}>
            <Text style={styles.bookingProperty}>{item.property}</Text>
            <Text style={styles.bookingStatus}>{item.status}</Text>
          </View>
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
  booking: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
  },
  bookingProperty: {
    fontSize: 18,
  },
  bookingStatus: {
    fontSize: 16,
    color: 'gray',
  },
});

export default BookingManagement;
