// src/screens/EditProfileScreen.jsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig'; // Adjust path as per your project structure
import { doc, setDoc } from 'firebase/firestore';
import { Button, Text } from 'react-native-elements';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { profileData } = route.params;

  const [name, setName] = useState(profileData.name || '');
  const [contactNumber, setContactNumber] = useState(profileData.contactNumber || '');
  const [email, setEmail] = useState(profileData.email || '');
  const [address, setAddress] = useState(profileData.address || '');
  const [whatsappNumber, setWhatsappNumber] = useState(profileData.whatsappNumber || '');

  const handleSaveProfile = async () => {
    const user = FIREBASE_Auth.currentUser;
    if (user) {
      try {
        const userRef = doc(FIRESTORE_DB, 'users', user.uid);
        await setDoc(userRef, {
          name,
          contactNumber,
          email,
          address,
          whatsappNumber // Save WhatsApp number
        }, { merge: true });
        Alert.alert('Profile updated successfully!');
        navigation.goBack();
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.header}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="WhatsApp Number" // New field
        value={whatsappNumber}
        onChangeText={setWhatsappNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    width: '100%',
  },
});

export default EditProfileScreen;
