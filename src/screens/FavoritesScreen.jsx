import React from 'react';
import { View, Text, FlatList } from 'react-native';

const FavoritesScreen = () => {
  const favorites = []; // Fetch favorites from your backend or state

  return (
    <View>
      <Text>Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FavoritesScreen;
