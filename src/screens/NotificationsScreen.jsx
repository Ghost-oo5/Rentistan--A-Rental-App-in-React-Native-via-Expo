import React from 'react';
import { View, Text, FlatList } from 'react-native';

const NotificationsScreen = () => {
  const notifications = []; // Fetch notifications from your backend or state

  return (
    <View>
      <Text>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <Text>{item.message}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default NotificationsScreen;
