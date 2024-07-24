import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { FAB, SearchBar } from 'react-native-elements';
import CustomDropdown from '../consts/CustomDropdown';
import Marker from '../consts/Marker';



const Home = ({ navigation }) => {
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState('');
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [sliderValues, setSliderValues] = useState([0, 100000]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([0, 20]); // Slider range for rooms
  const [sortOption, setSortOption] = useState('Price Low to High'); // Default sort option

  const filterAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserData = async (userId) => {
      const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.error(`User not found for ID: ${userId}`);
        return { name: 'Unknown User' };
      }
    };

    const unsubscribe = onSnapshot(collection(FIRESTORE_DB, 'rentals'), async (snapshot) => {
      const rentalList = [];
      const userMap = {};
      for (const docSnapshot of snapshot.docs) {
        const rentalData = { id: docSnapshot.id, ...docSnapshot.data() };
        if (!userMap[rentalData.postedBy]) {
          const userData = await fetchUserData(rentalData.postedBy);
          userMap[rentalData.postedBy] = userData;
        }
        rentalData.userName = userMap[rentalData.postedBy]?.name || 'Loading...';
        rentalList.push(rentalData);
      }
      setRentals(rentalList);
      setUsers(userMap);
      setFilteredRentals(rentalList);
    }, (error) => {
      console.error('Error fetching rentals: ', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let updatedRentals = rentals;

    if (search !== '') {
      updatedRentals = updatedRentals.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.userName.toLowerCase().includes(search.toLowerCase())
      );
    }

    updatedRentals = updatedRentals.filter(item => {
      const price = parseFloat(item.price) || 0;
      const rooms = parseFloat(item.rooms) || 0;

      return price >= sliderValues[0] && price <= sliderValues[1] &&
        (rooms >= selectedRooms[0] && rooms <= selectedRooms[1]);
    });

    if (sortOption === 'Price Low to High') {
      updatedRentals = updatedRentals.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceA - priceB;
      });
    } else if (sortOption === 'Price High to Low') {
      updatedRentals = updatedRentals.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA;
      });
    } else if (sortOption === 'Newest First') {
      updatedRentals = updatedRentals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    setFilteredRentals(updatedRentals);
  }, [search, rentals, sliderValues, selectedRooms, sortOption]);

  const handleDetailsPress = (item) => {
    navigation.navigate('ListingDetails', { item });
  };

  const handleViewUserProfile = (userId) => {
    console.log('Navigating to ViewUserProfile with userId:', userId);
    navigation.navigate('ViewUserProfile', { userId });
  };

  const handleFabPress = () => {
    navigation.navigate('AddRental');
  };

  const handleFilterPress = () => {
    setShowFilter(prev => !prev);
    Animated.timing(filterAnimation, {
      toValue: showFilter ? 0 : 1,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setShowFilter(false); // Close filter when sorting is applied
    Animated.timing(filterAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const renderItem = ({ item }) => {
    const hasImages = item.images && item.images.length > 0;
    const userName = item.userName || 'Loading...';
    const availabilityColor = item.availability === 'Available' ? '#25d366' : 'red';

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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={[styles.availabilityStatus, { backgroundColor: availabilityColor }]}>
              <Text style={styles.availabilityStatusText}>
                {item.availability || 'Not Available'}
              </Text>
            </View>
          </View>
          <Text style={styles.price}>PKR {item.price} / month</Text>
          <TouchableOpacity onPress={() => handleViewUserProfile(item.postedBy)}>
            <Text style={styles.postedBy}>Posted by: {userName}</Text>
          </TouchableOpacity>
          <View style={styles.specsContainer}>
            <View style={styles.specRow}>
              <View style={styles.specs}>
                <Icon name="map" size={20} color="#00ADEF" />
                <Text style={styles.specText}>{item.area}</Text>
              </View>
              <View style={styles.specs}>
                <Icon name="hotel" size={20} color="#00ADEF" />
                <Text style={styles.specText}>{item.rooms} rooms</Text>
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
        placeholder="Search by title or user..."
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBar}
        inputContainerStyle={{ backgroundColor: '#f1f1f1' }}
      />
      <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
        <Icon name="filter-list" size={24} color="#fff" />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      {showFilter && (
        <Animated.View style={[styles.filterContainer, { height: filterAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 400] // Adjusted to accommodate the ScrollView height
        }) }]}>
          <ScrollView>
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort By:</Text>
              <CustomDropdown
                options={['Price Low to High', 'Price High to Low', 'Newest First']}
                selectedOption={sortOption}
                onSelect={handleSortOptionChange}
              />
            </View>
            <View style={styles.sliderContainer}>
  <Text style={styles.sliderLabel}>Rooms: {selectedRooms[0]} - {selectedRooms[1]}</Text>
  <MultiSlider
    values={selectedRooms}
    onValuesChange={setSelectedRooms}
    min={0}
    max={20}
    step={1}
    selectedStyle={styles.selectedStyle}
    trackStyle={styles.trackStyle}
    markerStyle={styles.markerStyle}
    customMarker={Marker}
  />
</View>

<View style={styles.sliderContainer}>
  <Text style={styles.sliderLabel}>Price: PKR {sliderValues[0]} - PKR {sliderValues[1]}</Text>
  <MultiSlider
    values={sliderValues}
    onValuesChange={setSliderValues}
    min={0}
    max={100000}
    step={1000}
    selectedStyle={styles.selectedStyle}
    trackStyle={styles.trackStyle}
    markerStyle={styles.markerStyle}
    customMarker={Marker}
  />
</View>

          </ScrollView>
        </Animated.View>
      )}
      <FlatList
        data={filteredRentals}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <FAB
        title="Add Rental"
        placement="right"
        onPress={handleFabPress}
        icon={{ name: 'add', color: 'white' }}
        color="#00ADEF"
        style={styles.fab}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: 8,
  },
  availabilityStatus: {
    padding: 8,
    borderRadius: 15,
    marginBottom: 8,
  },
  availabilityStatusText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  postedBy: {
    fontSize: 14,
    color: '#00ADEF',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  specsContainer: {
    marginBottom: 8,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  specText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  detailsButton: {
    backgroundColor: '#00ADEF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sliderContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  marker: {
    backgroundColor: '#00ADEF',
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  selected: {
    backgroundColor: '#00ADEF',
  },
  unselected: {
    backgroundColor: '#ddd',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ADEF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: 120,
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Home;
