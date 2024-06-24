import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const MainChatScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);

  // Dummy data for conversations (replace with actual data or API integration)
  const initialConversations = [
    { id: '1', userName: 'John Doe', lastMessage: 'Hello!', unreadCount: 2 },
    { id: '2', userName: 'Jane Smith', lastMessage: 'Hi there!', unreadCount: 0 },
    { id: '3', userName: 'Michael Johnson', lastMessage: 'How are you?', unreadCount: 1 },
    { id: '4', userName: 'Emma Brown', lastMessage: 'See you later!', unreadCount: 0 },
    // Add more conversations as needed
  ];

  useEffect(() => {
    // Simulating API call to fetch conversations
    // Replace with actual API call
    setConversations(initialConversations);
  }, []);

  const navigateToChat = (conversation) => {
    // Navigate to individual chat screen with conversation details
    navigation.navigate('ChatRoom', { conversation }); // Ensure the screen name matches the one in your navigator
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToChat(item)}>
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  listContainer: {
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  lastMessage: {
    flex: 3,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MainChatScreen;
