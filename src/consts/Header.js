// Header.js
import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from '../../UserContext'; // Adjust the path as needed
import { FIRESTORE_DB } from '../../FirebaseConfig'; // Adjust the path as needed
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
    const { user, profileType, switchProfileType } = useContext(UserContext);
    const [profilePhotoURL, setProfilePhotoURL] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.uid) {
                try {
                    console.log('Fetching user profile for UID:', user.uid); // Debugging
                    const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log('User Data:', userData); // Debugging
                        const photoURL = userData?.photoURL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv_oL1l60gN7zHc_fMS11OeFR-mLDi3DgjNg&s'; // Default profile icon URL
                        setProfilePhotoURL(photoURL);
                        console.log('Profile photo URL:', photoURL); // Debugging URL
                    } else {
                        console.log('User document does not exist'); // Debugging
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    const handleProfileSwitch = () => {
        const newProfileType = profileType === 'renter' ? 'tenant' : 'renter';
        console.log('Switching to:', newProfileType); // Debugging
        switchProfileType(newProfileType);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('Notifications')}
            >
                <MaterialIcons name="notifications" size={28} color="red" />
            </TouchableOpacity>
            <View style={styles.centerContainer}>
                <TouchableOpacity
                    style={styles.switchIcon}
                    onPress={handleProfileSwitch}
                >
                    <MaterialIcons
                        name="change-circle"
                        size={28}
                        color="#00ADEF"
                    />
                </TouchableOpacity>
                {/* Display current profileType for debugging */}
                <Text>{profileType}</Text>
            </View>
            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('UserProfile')}
            >
                <Image
                    source={{ uri: profilePhotoURL }}
                    style={styles.profileImage}
                    onError={() => console.log('Error loading image')} // Debugging image load error
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    profileButton: {
        marginLeft: 10,
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#e0e0e0',
    },
    switchIcon: {
        padding: 10,
    },
    notificationButton: {
        marginRight: 'auto',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // Adjusted to ensure proper alignment
    },
});

export default Header;
