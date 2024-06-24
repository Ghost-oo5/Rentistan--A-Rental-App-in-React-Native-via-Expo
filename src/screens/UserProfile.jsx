import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const UserProfile = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1234567890');
  const [address, setAddress] = useState('1234 Main St, Anytown, USA');

  const handleSave = () => {
    // Add your save logic here (e.g., API call to update user profile)
    alert('Profile saved!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfile;
