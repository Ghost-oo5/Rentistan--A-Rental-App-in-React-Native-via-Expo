import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { FAB, SearchBar } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: viewportWidth } = Dimensions.get('window');

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

  const renderItem = ({ item }) => {
    const hasImages = item.images && item.images.length > 0;
    return (
      <View style={styles.card}>
        {hasImages ? (
          item.images.length > 1 ? (
            <Swiper
              style={styles.swiper}
              showsButtons={false}
              autoplay
              loop
            >
              {item.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.image} />
              ))}
            </Swiper>
          ) : (
            <Image source={{ uri: item.images[0] }} style={styles.image} />
          )
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image Available</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price} / month</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.postedBy}>Posted by: {item.postedBy}</Text>
          <View style={styles.specsContainer}>
            <View style={styles.specRow}>
              <View style={styles.specs}>
                <Icon name="map" size={20} color="#00ADEF" />
                <Text style={styles.specText}>Location: {item.area}</Text>
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
          </View>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleDetailsPress(item)}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
        renderItem={renderItem}
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
  swiper: {
    height: 250,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
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
  postedBy: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  specsContainer: {
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
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
