import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { FAB, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Home = ({ navigation }) => {
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredRentals, setFilteredRentals] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIRESTORE_DB, 'rentals'), (snapshot) => {
      const rentalList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRentals(rentalList);
      setFilteredRentals(rentalList);
    }, (error) => {
      console.error('Error fetching rentals: ', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredRentals(rentals);
    } else {
      setFilteredRentals(
        rentals.filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, rentals]);

  const handleDetailsPress = (item) => {
    navigation.navigate('ListingDetails', { item });
  };

  const handleFabPress = () => {
    navigation.navigate('AddRental');
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search by title..."
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBar}
        inputContainerStyle={{ backgroundColor: 'white' }}
      />
      <FlatList
        data={filteredRentals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price} / month</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.specsContainer}>
                <View style={styles.specs}>
                  <Icon name="map" size={20} color="#00ADEF" />
                  <Text style={styles.specText}>{item.area} Area</Text>
                </View>
                <View style={styles.specs}>
                  <Icon name="hotel" size={20} color="#00ADEF" />
                  <Text style={styles.specText}>{item.rooms} Rooms</Text>
                </View>
                <View style={styles.specs}>
                  <Icon name="kitchen" size={20} color="#00ADEF" />
                  <Text style={styles.specText}>{item.kitchen} Kitchen</Text>
                </View>
                <View style={styles.specs}>
                  <Icon name="bathtub" size={20} color="#00ADEF" />
                  <Text style={styles.specText}>{item.washroom} Washrooms</Text>
                </View>
                <View style={styles.specs}>
                  <Icon name="aspect-ratio" size={20} color="#00ADEF" />
                  <Text style={styles.specText}>{item.size} sq. m</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleDetailsPress(item)}
              >
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <FAB
        placement="right"
        color="#00ADEF"
        title={'Add Listing'}
        icon={{ name: 'add', color: 'white' }}
        onPress={handleFabPress}
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
  searchBar: {
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#00ADEF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  specsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping to the next line
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%', // Set width for three specs in a row
    marginBottom: 8, // Add some space below
  },
  specText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  detailsButton: {
    backgroundColor: '#00ADEF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
