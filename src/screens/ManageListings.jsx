import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FIRESTORE_DB } from '../../FirebaseConfig'; // Adjust the path if needed
import { doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';

const ManageListings = ({ item }) => {
  const [availability, setAvailability] = useState('Loading...');

  useEffect(() => {
    if (!item) return;

    const fetchAvailability = async () => {
      try {
        const listingDoc = await getDoc(doc(FIRESTORE_DB, 'rentals', item.id));
        if (listingDoc.exists()) {
          const listingData = listingDoc.data();
          setAvailability(listingData.availability || 'Unknown Status');
        } else {
          setAvailability('Unknown Status');
        }
      } catch (error) {
        console.error('Error fetching availability: ', error);
        setAvailability('Error fetching status');
      }
    };

    fetchAvailability();
  }, [item]);

  if (!item) {
    return <Text>Loading...</Text>;
  }

  const handleOwnerProfileClick = (postedBy) => {
    // Handle owner profile click
    console.log('Owner Profile Clicked:', postedBy);
  };

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>PKR {item.price} / month</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text
        style={[
          styles.status,
          availability === 'Available' ? styles.availableStatus : styles.rentedStatus,
        ]}
      >
        Status: {availability}
      </Text>

      <TouchableOpacity onPress={() => handleOwnerProfileClick(item.postedBy)}>
        <Text style={styles.postedBy}>Posted by: {item.userName}</Text>
      </TouchableOpacity>

      <View style={styles.facilitiesContainer}>
        <View style={styles.facility}>
          <Icon name="hotel" size={18} color="#1e90ff" />
          <Text style={styles.facilityText}>{item.rooms} Rooms</Text>
        </View>
        <View style={styles.facility}>
          <Icon name="kitchen" size={18} color="#1e90ff" />
          <Text style={styles.facilityText}>{item.kitchen} Kitchen</Text>
        </View>
        <View style={styles.facility}>
          <Icon name="bathtub" size={18} color="#1e90ff" />
          <Text style={styles.facilityText}>{item.washroom} Washrooms</Text>
        </View>
        <View style={styles.facility}>
          <Icon name="aspect-ratio" size={18} color="#1e90ff" />
          <Text style={styles.facilityText}>{item.size} m²</Text>
        </View>
        <View style={styles.facility}>
          <Icon name="map" size={18} color="#1e90ff" />
          <Text style={styles.facilityText}>{item.area} Area</Text>
        </View>
      </View>
    </View>
  );
};

ManageListings.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    postedBy: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    rooms: PropTypes.number.isRequired,
    kitchen: PropTypes.number.isRequired,
    washroom: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    area: PropTypes.string.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#777',
    marginVertical: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  availableStatus: {
    color: '#25d366',
  },
  rentedStatus: {
    color: 'red',
  },
  postedBy: {
    fontSize: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  facility: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginVertical: 5,
  },
  facilityText: {
    marginLeft: 5,
    color: '#888',
  },
});

export default ManageListings;
