import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image, // Import Image component
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loginpng from '../assets/images/misc/login.png';
import Googlepng from '../assets/images/misc/google.png';
import Facebookpng from '../assets/images/misc/facebook.png';
import Twitterpng from '../assets/images/misc/twitter.png';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

export default function LoginForm ({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={Loginpng}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Login</Text>

        <InputField
          label={'Email ID'}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={styles.icon}
            />
          }
          keyboardType="email-address"
        />

        <InputField
          label={'Password'}
          icon={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
          }
          inputType="password"
          fieldButtonLabel={"Forgot?"}
          fieldButtonFunction={() => { }}
        />

        <CustomButton label={"Login"} onPress={() => { }} />

        <Text style={styles.orText}>
          Or, login with ...
        </Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            onPress={() => { }}
            style={styles.socialButton}>
            <Image source={Googlepng} style={{height: 24, width: 24}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={styles.socialButton}>
            <Image source={Facebookpng} style={{height: 24, width: 24}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={styles.socialButton}>
            <Image source={Twitterpng} style={{height: 24, width: 24}} />
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.registerLink}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    transform: [{ rotate: '-5deg' }],
    width: 200,
    height: 200,
  },
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 28,
    fontWeight: '500',
    color: '#333',
    marginBottom: 30,
  },
  icon: {
    marginRight: 5,
  },
  orText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  registerText: {
    marginRight: 5,
  },
  registerLink: {
    color: '#AD40AF',
    fontWeight: '700',
  },
});
