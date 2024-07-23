import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for WhatsApp icon
import Swiper from 'react-native-swiper';
import COLORS from '../consts/colors';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('screen');

const ListingDetails = ({ route, navigation }) => {
  const { item } = route.params;
  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    contactNumber: '',
    email: '',
    whatsappNumber: '',
    photoURL: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', item.postedBy));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile({
            name: userData.name || 'Unknown User',
            contactNumber: userData.contactNumber || '',
            email: userData.email || '',
            whatsappNumber: userData.whatsappNumber || '',
            photoURL: userData.photoURL || ''
          });
        } else {
          setUserProfile({
            name: 'Unknown User',
            contactNumber: '',
            email: '',
            whatsappNumber: '',
            photoURL: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
        setUserProfile({
          name: 'Error fetching user',
          contactNumber: '',
          email: '',
          whatsappNumber: '',
          photoURL: ''
        });
      }
    };

    fetchUserData();
  }, [item.postedBy]);

  const handleChatClick = () => {
    const conversation = {
      id: item.postedBy,
      userName: userProfile.name,
    };
    navigation.navigate('ChatRoom', { conversation });
  };

  const handleCallClick = () => {
    Linking.openURL(`tel:${userProfile.contactNumber}`);
  };

  const handleWhatsAppClick = () => {
    const message = `Hello, I'm interested in your rental listing: ${item.title}`;
    Linking.openURL(`whatsapp://send?phone=${userProfile.whatsappNumber}&text=${message}`);
  };

  const handleEmailClick = () => {
    Linking.openURL(`mailto:${userProfile.email}?subject=Rental Inquiry: ${item.title}`);
  };

  const handleOwnerProfileClick = () => {
    navigation.navigate('ViewUserProfile', { userId: item.postedBy });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />
      <ScrollView>
        <View style={styles.container}>
          {item.images && item.images.length > 0 ? (
            <Swiper style={styles.swiper} showsButtons={false} autoplay loop>
              {item.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.image} />
              ))}
            </Swiper>
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>No Images Available</Text>
            </View>
          )}

          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price} / month</Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* Posted By Section */}
            <TouchableOpacity onPress={handleOwnerProfileClick}>
              <Text style={styles.postedBy}>Posted by: {userProfile.name}</Text>
            </TouchableOpacity>

            {/* Additional Details */}
            <View style={styles.facilitiesContainer}>
              <View style={styles.facility}>
                <Icon name="hotel" size={18} color={COLORS.primary} />
                <Text style={styles.facilityText}>{item.rooms} Rooms</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="kitchen" size={18} color={COLORS.primary} />
                <Text style={styles.facilityText}>{item.kitchen} Kitchen</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="bathtub" size={18} color={COLORS.primary} />
                <Text style={styles.facilityText}>{item.washroom} Washrooms</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="aspect-ratio" size={18} color={COLORS.primary} />
                <Text style={styles.facilityText}>{item.size} m²</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="map" size={18} color={COLORS.primary} />
                <Text style={styles.facilityText}>{item.area} Area</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactContainer}>
            <TouchableOpacity style={[styles.contactButton, styles.chatButton]} onPress={handleChatClick}>
              <Icon name="chat" size={24} color="#fff" />
              <Text style={styles.contactButtonText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, styles.callButton]} onPress={handleCallClick}>
              <Icon name="phone" size={24} color="#fff" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.contactButton, styles.emailButton]} onPress={handleEmailClick}>
              <Icon name="email" size={24} color="#fff" />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.whatsappContainer}>
            <TouchableOpacity style={[styles.contactButton, styles.whatsappButton]} onPress={handleWhatsAppClick}>
              <FontAwesome name="whatsapp" size={24} color="#fff" />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  swiper: {
    height: width * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: width * 0.6,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  noImageContainer: {
    width: '100%',
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
  },
  detailsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.grey,
    marginVertical: 10,
  },
  postedBy: {
    fontSize: 16,
    color: COLORS.blue,
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  facility: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  facilityText: {
    marginLeft: 5,
    color: COLORS.grey,
    fontSize: 16,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  contactButton: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  chatButton: {
    backgroundColor: '#007BFF',
  },
  callButton: {
    backgroundColor: '#28A745',
  },
  emailButton: {
    backgroundColor: '#FF5722',
  },
  whatsappContainer: {
    marginTop: 20,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 10,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ListingDetails;
