import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Dimensions, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../consts/colors';

const { width } = Dimensions.get('screen');

const ListingDetails = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />

      <ScrollView>
        <View style={styles.container}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price} / month</Text>
            <Text style={styles.description}>{item.description}</Text>
            {/* <Text style={styles.location}><Icon name="location-pin" size={20} color={COLORS.grey} /> {item.location}</Text> */}
            
            {/* Additional Details */}
            <View style={styles.facilitiesContainer}>
              <View style={styles.facility}>
                <Icon name="hotel" size={18} />
                <Text style={styles.facilityText}>{item.rooms} Rooms</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="kitchen" size={18} />
                <Text style={styles.facilityText}>{item.kitchen} Kitchen</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="bathtub" size={18} />
                <Text style={styles.facilityText}>{item.washroom} Washrooms</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="aspect-ratio" size={18} />
                <Text style={styles.facilityText}>{item.size} m²</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="map" size={18} />
                <Text style={styles.facilityText}>{item.area} Area</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Chats')}
          >
            <Text style={styles.buttonText}>Contact</Text>
            <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: width * 0.8,
    borderRadius: 15,
  },
  detailsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.grey,
    marginVertical: 10,
  },
  location: {
    fontSize: 16,
    color: COLORS.grey,
    marginVertical: 10,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    marginTop: 20,
    flexWrap: 'wrap', // Allow wrapping of facilities
  },
  facility: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  facilityText: {
    marginLeft: 5,
    color: COLORS.grey,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00ADEF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 50,
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 8, height: 8 },
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ListingDetails;
