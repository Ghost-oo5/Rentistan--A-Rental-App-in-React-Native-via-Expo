// src/screens/MainChatScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';

const MainChatScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('MainChatScreen mounted');
    const q = query(collection(FIRESTORE_DB, 'chats'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const conversations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setConversations(conversations);
        setLoading(false);
        console.log('Fetched conversations:', conversations);
      } catch (error) {
        console.error("Error fetching conversations: ", error);
        setError("Failed to load conversations.");
        setLoading(false);
      }
    }, (error) => {
      console.error("Snapshot error: ", error);
      setError("Failed to load conversations.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const navigateToChat = (conversation) => {
    navigation.navigate('ChatRoom', {
      conversation: {
        id: conversation.id,
        senderId: conversation.senderId,
        receiverId: conversation.receiverId,
        senderName: conversation.senderName,
        receiverName: conversation.receiverName,
        lastMessage: conversation.lastMessage,
        unreadCount: conversation.unreadCount,
        messages: conversation.messages,
        participants: conversation.participants,
      },
    });
  };

  const navigateToUserSelection = () => {
    navigation.navigate('UserSelectionScreen');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToChat(item)}>
      <Text style={styles.userName}>{item.receiverName || 'No Name'}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage || 'No Messages'}</Text>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ADEF" />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Start Chat" onPress={navigateToUserSelection} />
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text>No conversations available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
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
    color: '#333',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MainChatScreen;
