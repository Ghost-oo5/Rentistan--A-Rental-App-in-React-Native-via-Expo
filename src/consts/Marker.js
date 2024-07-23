import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Marker = ({ currentValue }) => (
  <View style={styles.markerContainer}>
    <View style={styles.marker}>
      <Text style={styles.markerText}>{currentValue}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  marker: {
    backgroundColor: '#00ADEF',
    borderColor: '#fff',
    borderWidth: 2,
    width: 80,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Marker;
