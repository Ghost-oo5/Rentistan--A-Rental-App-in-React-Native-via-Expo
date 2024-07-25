// src/screens/UserSelectionScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const UserSelectionScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users: ", error);
        setError("Failed to load users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const startConversation = async (receiver) => {
    const auth = FIREBASE_Auth;
    const user = auth.currentUser; // Get current authenticated user
    const senderId = user.uid;
    const senderName = user.displayName || 'User';
  
    try {
      const chatDoc = await addDoc(collection(FIRESTORE_DB, 'chats'), {
        senderId: senderId,
        receiverId: receiver.id,
        senderName: senderName,
        receiverName: receiver.name,
        lastMessage: '', // Initialize as empty
        unreadCount: 0,
        messages: [], // Initialize as empty array
        participants: [senderId, receiver.id],
      });
  
      // Get the newly created chat document's ID
      const chatId = chatDoc.id;
  
      // Navigate to ChatRoom with the conversation details
      navigation.navigate('ChatRoom', {
        conversation: {
          id: chatId,
          senderId: senderId,
          receiverId: receiver.id,
          senderName: senderName,
          receiverName: receiver.name,
          lastMessage: '',
          unreadCount: 0,
          messages: [],
          participants: [senderId, receiver.id],
        },
      });
    } catch (error) {
      console.error("Error starting conversation: ", error);
    }
  };
  

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {users.length > 0 ? (
        <View style={styles.listContainer}>
          {users.map(user => (
            <TouchableOpacity
              key={user.id}
              style={styles.userItem}
              onPress={() => startConversation(user)}
            >
              <Text style={styles.userName}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.errorText}>No users available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingVertical: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
});

export default UserSelectionScreen;
