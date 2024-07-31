import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { FAB, SearchBar } from 'react-native-elements';

const { width } = Dimensions.get('screen');

const ManageListings = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserListings = async () => {
      const unsubscribeAuth = FIREBASE_Auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUserId(user.uid);
          const userQuery = query(collection(FIRESTORE_DB, 'rentals'), where('postedBy', '==', user.uid));
          const unsubscribeListings = onSnapshot(userQuery, (snapshot) => {
            const listingsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setListings(listingsList);
            setFilteredListings(listingsList);
          });
          
          return () => {
            unsubscribeListings();
          };
        } else {
          setUserId(null);
          setListings([]);
          setFilteredListings([]);
        }
      });

      return () => {
        unsubscribeAuth();
      };
    };

    fetchUserListings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(FIRESTORE_DB, 'rentals', id));
      setListings(listings.filter((listing) => listing.id !== id));
      setFilteredListings(filteredListings.filter((listing) => listing.id !== id));
      Alert.alert('Success', 'Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing: ', error);
      Alert.alert('Error', 'Failed to delete listing');
    }
  };

  const handleEdit = (item) => {
    navigation.navigate('EditListing', { item });
  };

  const handleSearch = (search) => {
    setSearch(search);
    if (search === '') {
      setFilteredListings(listings);
    } else {
      const filteredData = listings.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredListings(filteredData);
    }
  };

  const handleFabPress = () => {
    navigation.navigate('AddRental');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Manage Your Listings</Text>
      </View>
      <SearchBar
        placeholder="Search Listings..."
        onChangeText={handleSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />
      <ScrollView>
        <View style={styles.container}>
          {filteredListings.map((item) => (
            <View key={item.id} style={styles.listingContainer}>
              <View style={styles.imageContainer}>
                {item.images && item.images.length > 0 ? (
                  <Swiper style={styles.swiper} showsButtons={false} autoplay loop>
                    {item.images.map((image, index) => (
                      <Image key={index} source={{ uri: image }} style={styles.image} />
                    ))}
                  </Swiper>
                ) : (
                  <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>No Images Available</Text>
                  </View>
                )}
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>PKR {item.price} / month</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text
                  style={[
                    styles.status,
                    item.availability === 'Available' ? styles.availableStatus : styles.rentedStatus,
                  ]}
                >
                  Status: {item.availability}
                </Text>
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
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <FAB
        title="Add Rental"
        placement="right"
        onPress={handleFabPress}
        icon={{ name: 'add', color: 'white' }}
        color="#00ADEF"
        style={styles.fab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchBarInput: {
    backgroundColor: '#f0f0f0',
  },
  listingContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  swiper: {
    height: width * 0.6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: width * 0.6,
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: '100%',
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  availableStatus: {
    color: '#25d366',
  },
  rentedStatus: {
    color: 'red',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#00ADEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ManageListings;
