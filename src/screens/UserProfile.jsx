import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, SectionList } from 'react-native';
import { FIRESTORE_DB, FIREBASE_Auth } from '../../FirebaseConfig';
import { collection, getDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ListItem, Icon, Text, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const ProfileScreen = () => {
  const [listings, setListings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const navigation = useNavigation();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribeAuth = FIREBASE_Auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserProfile(user);
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setContactNumber(data.contactNumber || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
          setProfileImage(data.photoURL || '');
        }
      } else {
        setUserProfile(null);
      }
    });

    const unsubscribeListings = onSnapshot(collection(FIRESTORE_DB, 'rentals'), (snapshot) => {
      const listingsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(listingsList);
    });

    return () => {
      unsubscribeAuth();
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
    navigation.navigate('EditListing', { item });
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen', { profileData: { name, contactNumber, email, address } });
  };

  // Function to convert local file URI to a blob
 
const getBlobFromUri = async (uri) => {
  try {
    const response = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const blob = await new Blob([response], { type: 'image/jpeg' });
    return blob;
  } catch (error) {
    console.error('Error converting URI to blob:', error);
    throw error;
  }
};
  // Updated uploadProfileImage function
  const uploadProfileImage = async (uri) => {
    try {
      let blob;
      if (uri.startsWith('file://')) {
        blob = await getBlobFromUri(uri);
      } else {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        blob = await response.blob();
      }
  
      const storageRef = ref(storage, `profilePictures/${userProfile.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Uploaded image URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error during image upload:', error);
      if (error.code === 'storage/unknown') {
        // Handle specific Firebase Storage errors
        console.error('Firebase Storage Error:', error.message);
      } else {
        // Handle general network errors
        console.error('Network Error:', error.message);
      }
      throw error; // Propagate the error to handle it further up in the call stack
    }
  };
  
  
  
  
  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission result:', permissionResult);
  
      if (!permissionResult.granted) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }
  
      const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3] });
      console.log('Picker result:', pickerResult);
  
      if (!pickerResult.cancelled && pickerResult.assets.length > 0) {
        const pickedImage = pickerResult.assets[0]; // Access the first asset in the assets array
        const { uri } = pickedImage;
        console.log('Picked image URI:', uri);
  
        // Check if URI is valid
        if (!uri) {
          console.error('URI is undefined or null.');
          Alert.alert('Error', 'Failed to pick image. Please try again.');
          return;
        }
  
        setProfileImage(uri);
  
        const imageUrl = await uploadProfileImage(uri);
        await updateProfileImage(imageUrl);
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };
  
  

  const updateProfileImage = async (imageUrl) => {
    try {
      const userDocRef = doc(FIRESTORE_DB, 'users', userProfile.uid);
      await updateDoc(userDocRef, { photoURL: imageUrl });
      setUserProfile({ ...userProfile, photoURL: imageUrl });
      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert('Error', 'Failed to update profile image.');
    }
  };

  const renderProfileSection = () => (
    <View style={styles.profileContainer}>
      {userProfile && (
        <>
          <Image source={{ uri: profileImage || userProfile.photoURL }} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIconContainer} onPress={handleImageUpload}>
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
    marginBottom: 16,
    color: 'gray',
  },
  header: {
    marginBottom: 8,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoValue: {
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#00ADEF',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
});

export default ProfileScreen;
