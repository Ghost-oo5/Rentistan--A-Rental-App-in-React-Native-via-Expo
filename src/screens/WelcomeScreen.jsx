// src/screens/WelcomeScreen.jsx
import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import favicon from '../assets/Rentistan-Logo-blue.png';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.TitleText}>Rentistan</Text>
        <Text style={styles.H2Text}>Let's find you a perfect home :)</Text>
      </View>
      <Image source={favicon} style={styles.logoImage} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Registration')}
      >
        <Text style={styles.buttonText}>Let's Begin</Text>
        <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  topSection: {
    marginTop: 100,
    alignItems: 'center',
  },
  TitleText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#20315f',
  },
  H2Text: {
    marginTop: 10,
    fontSize: 18,
    color: '#20315f',
    textAlign: 'center',
  },
  logoImage: {
    marginTop: 0,
    marginBottom: 20,
    width: 300,
    height: 200,
  },
  button: {
    backgroundColor: '#00ADEF',
    padding: 20,
    width: '90%',
    borderRadius: 10,
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 8, height: 8 },
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});