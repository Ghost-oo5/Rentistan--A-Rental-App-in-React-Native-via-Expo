import React from 'react';
import { View, Text, FlatList } from 'react-native';

const ReviewsAndRatingsScreen = () => {
  const reviews = []; // Fetch reviews from your backend or state

  return (
    <View>
      <Text>Reviews and Ratings</Text>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View>
            <Text>{item.user}</Text>
            <Text>{item.review}</Text>
            <Text>{item.rating}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ReviewsAndRatingsScreen;
