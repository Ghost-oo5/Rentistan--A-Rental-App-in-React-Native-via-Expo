import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

// Import icons from a library like `react-native-vector-icons`
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const RenterDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Dashboard</Text>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Home')}
        >
          <MaterialIcons name="search" size={30} color="#ffffff" />
          <Text style={styles.cardText}>Browse Listings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ManageListings')}
        >
          <MaterialIcons name="event" size={30} color="#ffffff" />
          <Text style={styles.cardText}>Manage Listings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('FavoriteScreen')} 
        >
          <MaterialIcons name="favorite" size={30} color="#ffffff" />
          <Text style={styles.cardText}>Favorites</Text>
        </TouchableOpacity>

        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#00ADEF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
});

export default RenterDashboard;
