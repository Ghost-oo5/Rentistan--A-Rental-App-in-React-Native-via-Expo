import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ChatRoom = ({ route }) => {
  const { conversation } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Dummy data for messages (replace with actual data or API integration)
  const initialMessages = [
    { id: '1', text: 'Hello!', sender: 'user' },
    { id: '2', text: 'Hi there!', sender: 'agent' },
    { id: '3', text: 'How can I help you today?', sender: 'agent' },
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = { id: String(messages.length + 1), text: inputMessage, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Simulate agent's reply (replace with actual logic)
    setTimeout(() => {
      const replyMessage = { id: String(messages.length + 2), text: 'I will assist you shortly.', sender: 'agent' };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 1000); // Simulate delay
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.agentBubble]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{conversation.userName}</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.messageList}
        inverted // Start displaying messages from bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 20,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  agentBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#6c757d',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatRoom;
