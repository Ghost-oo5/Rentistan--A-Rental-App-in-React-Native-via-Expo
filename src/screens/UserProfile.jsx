import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, SectionList } from 'react-native';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig'; // Adjust path as per your project structure
import { collection, getDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ListItem, Icon, Text, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'; // Import navigation

const ProfileScreen = () => {
  const [listings, setListings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const navigation = useNavigation(); // Use navigation hook

  useEffect(() => {
    const unsubscribe = FIREBASE_Auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserProfile(user);
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setContactNumber(data.contactNumber || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
        }
      } else {
        setUserProfile(null);
      }
    });

    const unsubscribeListings = onSnapshot(collection(FIRESTORE_DB, 'rentals'), (snapshot) => {
      const listingsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListings(listingsList);
    }, (error) => {
      console.error('Error fetching listings: ', error);
    });

    return () => {
      unsubscribe();
      unsubscribeListings();
    };
  }, []);

  const handleDeleteListing = async (id) => {
    try {
      await deleteDoc(doc(FIRESTORE_DB, 'rentals', id));
      Alert.alert('Success', 'Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing:', error);
      Alert.alert('Error', 'Failed to delete listing.');
    }
  };

  const handleModifyListing = (item) => {
    console.log('Edit Listing pressed');
    // Navigate to EditListing screen with the listing item as route parameter
    navigation.navigate('EditListing', { item });
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen', { profileData: { name, contactNumber, email, address } });
  };

  const renderProfileSection = () => (
    <View style={styles.profileContainer}>
      {userProfile && (
        <>
          <Image source={{ uri: userProfile.photoURL }} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIconContainer} onPress={handleEditProfile}>
            <Icon name="edit" color="#00ADEF" />
          </TouchableOpacity>
          <Text h4 style={styles.username}>{userProfile.displayName}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
        </>
      )}
      <Text h4 style={styles.header}>Profile Information</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Name</Text>
        <Text style={styles.infoValue}>{name}</Text>
        <Text style={styles.infoLabel}>Contact Number</Text>
        <Text style={styles.infoValue}>{contactNumber}</Text>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{email}</Text>
        <Text style={styles.infoLabel}>Address</Text>
        <Text style={styles.infoValue}>{address}</Text>
        <Button title="Edit Information" onPress={handleEditProfile} buttonStyle={styles.editButton} />
      </View>
    </View>
  );

  const renderListingItem = ({ item }) => (
    <ListItem bottomDivider>
      <Image source={{ uri: item.image }} style={styles.image} />
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>${item.price} / month</ListItem.Subtitle>
        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
      </ListItem.Content>
      <TouchableOpacity onPress={() => handleDeleteListing(item.id)}>
        <Icon name="delete" color="red" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleModifyListing(item)}>
        <Icon name="edit" color="#00ADEF" />
      </TouchableOpacity>
    </ListItem>
  );

  return (
    <SectionList
      sections={[
        { title: 'Profile', data: [{}], renderItem: renderProfileSection },
        { title: 'My Listings', data: listings, renderItem: renderListingItem }
      ]}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderSectionHeader={({ section: { title } }) => (
        <Text h4 style={styles.header}>{title}</Text>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  editIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  username: {
    marginBottom: 4,
  },
  email: {
    color: 'gray',
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
    marginTop: 16,
  },
  infoContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#00ADEF',
    marginTop: 16,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
});

export default ProfileScreen;
