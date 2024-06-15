import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const Home = () => {
  const rentals = [
    {
      id: '1',
      title: 'Cozy Apartment',
      image: 'https://via.placeholder.com/150',
      price: '1200',
      description: 'A cozy apartment in the city center.',
    },
    {
      id: '2',
      title: 'Luxury Villa',
      image: 'https://via.placeholder.com/150',
      price: '2500',
      description: 'A luxurious villa with a beautiful garden.',
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={rentals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price} / month</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
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
    backgroundColor: '#f8f8f8',
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
  },
});

export default Home;
