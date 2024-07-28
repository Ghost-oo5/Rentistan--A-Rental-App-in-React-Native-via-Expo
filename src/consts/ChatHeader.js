// src/components/ChatHeader.jsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ChatHeader = ({ receiverName, receiverPhoto }) => {
  return (
    <View style={styles.container}>
      {receiverPhoto ? (
        <Image source={{ uri: receiverPhoto }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.name}>{receiverName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  name: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatHeader;
