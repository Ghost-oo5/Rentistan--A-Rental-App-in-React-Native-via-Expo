// src/screens/FavoritesScreen.jsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig'; // Import the correct module
import { doc, getDoc } from 'firebase/firestore';

const FavoriteScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    const user = FIREBASE_Auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const favoriteIds = userData.favorites || [];

          // Fetch listings details
          const listingsPromises = favoriteIds.map(id => getDoc(doc(FIRESTORE_DB, 'rentals', id)));
          const listingsDocs = await Promise.all(listingsPromises);
          const favoriteListings = listingsDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() }));

          setFavorites(favoriteListings);
        }
      } catch (error) {
        console.error('Error fetching favorites: ', error);
      }
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView>
        <View style={styles.container}>
          {loading ? (
            <Text>Loading...</Text>
          ) : favorites.length > 0 ? (
            favorites.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={styles.listingCard}
                onPress={() => navigation.navigate('ListingDetails', { item: listing })}
              >
                {listing.images && listing.images.length > 0 ? (
                  <Image
                    source={{ uri: listing.images[0] }}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>No Image</Text>
                  </View>
                )}
                <View style={styles.details}>
                  <Text style={styles.title}>{listing.title}</Text>
                  <Text style={styles.price}>PKR {listing.price} / month</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No favorites yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  listingCard: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  noImageText: {
    color: '#888',
  },
  details: {
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#1e90ff',
  },
});

export default FavoriteScreen;
