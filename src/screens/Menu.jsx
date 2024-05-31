import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Menu</Text>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#013220',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  linkText: {
    fontSize: 18,
    color: '#00ADEF',
    textAlign: 'center',
    marginTop: 20,
  },
});
