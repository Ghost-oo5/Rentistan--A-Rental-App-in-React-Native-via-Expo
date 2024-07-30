import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TenantProfile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tenant Profile</Text>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfileScreen')}
      />
      <Button
        title="Payment History"
        onPress={() => navigation.navigate('PaymentHistory')}
      />
      <Button
        title="Reviews and Ratings"
        onPress={() => navigation.navigate('ReviewsAndRatingsScreen')}
      />
      <Button
        title="Help and Support"
        onPress={() => navigation.navigate('HelpAndSupportScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default TenantProfile;
