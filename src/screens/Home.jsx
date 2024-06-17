import React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import COLORS from '../consts/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('screen');

const rentals = [
  {
    id: '1',
    title: 'Cozy Apartment',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D',
    price: '1200',
    description: 'A cozy apartment in the city center.',
    location: 'City Center',
  },
  {
    id: '2',
    title: 'Luxury Villa',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww',
    price: '2500',
    description: 'A luxurious villa with a beautiful garden.',
    location: 'Suburbs',
  },
  {
    id: '3',
    title: 'Modern Loft',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww',
    price: '1800',
    description: 'A modern loft in the downtown area.',
    location: 'Downtown',
  },
];

const Home = ({ navigation }) => {
  const optionsList = [
    // {title: 'Buy a Home', img: require('../assets/house1.jpg')},
    // {title: 'Rent a Home', img: require('../assets/house2.jpg')},
  ];
  const categoryList = ['Popular', 'Recommended', 'Nearest'];

  const ListCategories = () => {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    return (
      <View style={style.categoryListContainer}>
        {categoryList.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedCategoryIndex(index)}>
            <Text
              style={[
                style.categoryListText,
                index == selectedCategoryIndex && style.activeCategoryListText,
              ]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const ListOptions = () => {
    return (
      <View style={style.optionListsContainer}>
        {optionsList.map((option, index) => (
          <TouchableOpacity>
            <View style={style.optionsCard} key={index}>
              {/* House image */}
              <Image source={option.img} style={style.optionsCardImage} />

              {/* Option title */}
              <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                {option.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const Card = ({ house }) => {
    return (
      <Pressable
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ListingDetails', { item: house })}>
        <View style={style.card}>
          {/* House image */}
          <Image source={{ uri: house.image }} style={style.cardImage} />
          <View style={{ marginTop: 10 }}>
            {/* Title and price container */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {house.title}
              </Text>
              <Text
                style={{ fontWeight: 'bold', color: COLORS.blue, fontSize: 16 }}>
                ${house.price}
              </Text>
            </View>

            {/* Location text */}
            <Text style={{ color: COLORS.grey, fontSize: 14, marginTop: 5 }}>
              {house.location}
            </Text>

            {/* Facilities container */}
            <View style={{ marginTop: 10, flexDirection: 'row' }}>
              <View style={style.facility}>
                <Icon name="hotel" size={18} />
                <Text style={style.facilityText}>2</Text>
              </View>
              <View style={style.facility}>
                <Icon name="bathtub" size={18} />
                <Text style={style.facilityText}>2</Text>
              </View>
              <View style={style.facility}>
                <Icon name="aspect-ratio" size={18} />
                <Text style={style.facilityText}>100m</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderHeader = () => {
    return (
      <>
        {/* Header container */}
        <View style={style.header}>
          <View>
            <Text style={{ color: COLORS.grey }}>Location</Text>
            <Text style={{ color: COLORS.dark, fontSize: 20, fontWeight: 'bold' }}>
              Chakwal
            </Text>
          </View>
          <Image
            style={style.profileImage}
            source={require('../assets/person.jpg')}
          />
        </View>

        {/* Input and sort button container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <View style={style.searchInputContainer}>
            <Icon name="search" color={COLORS.grey} size={25} />
            <TextInput placeholder="Search address, city, location" />
          </View>

          <View style={style.sortBtn}>
            <Icon name="tune" color={COLORS.white} size={25} />
          </View>
        </View>

        {/* Render list options */}
        <ListOptions />

        {/* Render categories */}
        <ListCategories />
      </>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      {/* Customize status bar */}
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />

      {/* Render FlatList with header */}
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingVertical: 20 }}
        data={rentals}
        renderItem={({ item }) => <Card house={item} />}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sortBtn: {
    backgroundColor: COLORS.dark,
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  optionsCard: {
    height: 210,
    width: width / 2 - 30,
    elevation: 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  optionsCardImage: {
    height: 140,
    borderRadius: 10,
    width: '100%',
  },
  optionListsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryListText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: COLORS.grey,
  },
  activeCategoryListText: {
    color: COLORS.dark,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  categoryListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    elevation: 10,
    marginBottom: 20,
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
  },
  facility: {
    flexDirection: 'row',
    marginRight: 15,
  },
  facilityText: {
    marginLeft: 5,
    color: COLORS.grey,
  },
});

export default Home;
