import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loginpng from '../assets/Rentistan-Logo-blue.png';
import Googlepng from '../assets/images/misc/google.png';
import Facebookpng from '../assets/images/misc/facebook.png';
import Twitterpng from '../assets/images/misc/twitter.png';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://your-backend-url/login', {
        email,
        password,
      });

      if (response.data.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={Loginpng} style={styles.logo} />
        </View>

        <InputField
          label={'Email ID:'}
          icon={
            <MaterialIcons name="alternate-email" size={20} color="#666" style={styles.icon} />
          }
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <InputField
          label={'Password:'}
          icon={
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          }
          inputType="password"
          value={password}
          onChangeText={setPassword}
          fieldButtonLabel={"Forgot?"}
          fieldButtonFunction={() => {}}
        />

        <CustomButton label={"Login"} onPress={handleLogin} />

        <Text style={styles.orText}>Or, login with ...</Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity onPress={() => {}} style={styles.socialButton}>
            <Image source={Googlepng} style={styles.socialButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.socialButton}>
            <Image source={Facebookpng} style={styles.socialButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.socialButton}>
            <Image source={Twitterpng} style={styles.socialButtonIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegistrationScreen')}>
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
    width: 200,
    height: 200,
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
  socialButtonIcon: {
    height: 24,
    width: 24,
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
    color: '#00ADEF',
    fontWeight: '700',
  },
});
