import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, onSnapshot, query, doc, getDoc } from 'firebase/firestore';

const MainChatScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    // Replace with your method to get current user ID
    const fetchCurrentUserId = async () => {
      // Example: setCurrentUserId(await getCurrentUserId());
    };
    
    fetchCurrentUserId();

    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const q = query(collection(FIRESTORE_DB, 'chats'));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          try {
            const conversations = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            // Collect all unique user IDs
            const userIds = new Set();
            conversations.forEach(conv => {
              if (conv.senderId) userIds.add(conv.senderId);
              if (conv.receiverId) userIds.add(conv.receiverId);
            });

            // Fetch user details
            const userDetailsMap = {};
            for (const userId of userIds) {
              const userRef = doc(FIRESTORE_DB, 'users', userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                userDetailsMap[userId] = { ...userSnap.data(), _id: userId };
              }
            }

            setUserDetails(userDetailsMap);
            setConversations(conversations);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching conversations or user details: ", error);
            setError("Failed to load conversations.");
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user details: ", error);
        setError("Failed to load user details.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const navigateToChat = (conversation) => {
    if (!conversation.senderId || !conversation.receiverId) {
      console.warn('Invalid conversation data:', conversation);
      return;
    }

    navigation.navigate('ChatRoom', {
      conversation: {
        id: conversation.id,
        senderId: conversation.senderId,
        receiverId: conversation.receiverId,
        senderName: userDetails[conversation.senderId]?.name || 'Unknown Sender',
        receiverName: userDetails[conversation.receiverId]?.name || 'Unknown Receiver',
        lastMessage: conversation.lastMessage,
        unreadCount: conversation.unreadCount,
        messages: conversation.messages,
        participants: conversation.participants,
      },
    });
  };

  const renderItem = ({ item }) => {
    if (!item.senderId || !item.receiverId) {
      console.warn('Invalid item data:', item);
      return null;
    }

    const displayName = currentUserId === item.receiverId ? userDetails[item.senderId]?.name : userDetails[item.receiverId]?.name;

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToChat(item)}>
        <Text style={styles.userName}>{displayName || 'No Name'}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage || 'No Messages'}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
      <Button title="Start Chat" onPress={() => navigation.navigate('UserSelectionScreen')} />
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
