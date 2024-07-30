import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HelpAndSupportScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help and Support</Text>
      <Button
        title="Contact Support"
        onPress={() => navigation.navigate('ContactSupport')}
      />
      <Button
        title="FAQs"
        onPress={() => navigation.navigate('FAQs')}
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

export default HelpAndSupportScreen;
