import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Registrationpng from '../assets/Rentistan-Logo-blue.png';
import Googlepng from '../assets/images/misc/google.png';
import Facebookpng from '../assets/images/misc/facebook.png';
import Twitterpng from '../assets/images/misc/twitter.png';
import CustomButton from '../components/CustomButton';

export default function RegisterScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState('Date of Birth');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.centeredView}>
          <Image
            source={Registrationpng}
            height={100}
            width={100}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Register</Text>

        <View style={styles.socialButtonContainer}>
          <TouchableOpacity
            onPress={() => { }}
            style={styles.socialButton}>
            <Image source={Googlepng} style={styles.socialButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={styles.socialButton}>
            <Image source={Facebookpng} style={styles.socialButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={styles.socialButton}>
            <Image source={Twitterpng} style={styles.socialButtonIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.orText}>Or, register with email ...</Text>

        <InputField
          label={'Full Name'}
          icon={<Ionicons name="person-outline" size={20} color="#666" />}
          style={styles.inputField}
        />

        <InputField
          label={'Email ID'}
          icon={<MaterialIcons name="alternate-email" size={20} color="#666" />}
          keyboardType="email-address"
          style={styles.inputField}
        />

        <InputField
          label={'Password'}
          icon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
          inputType="password"
          style={styles.inputField}
        />

        <InputField
          label={'Confirm Password'}
          icon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
          inputType="password"
          style={styles.inputField}
        />

        <View style={styles.datePickerContainer}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={styles.datePickerLabel}>{dobLabel}</Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          modal
          open={open}
          date={date}
          mode={'date'}
          maximumDate={new Date('2005-01-01')}
          minimumDate={new Date('1980-01-01')}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            setDobLabel(date.toDateString());
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <CustomButton label={'Register'} onPress={() => navigation.navigate('Home')} />

        <View style={styles.registerLinkContainer}>
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.registerLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    paddingHorizontal: 25,
  },
  centeredView: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 28,
    fontWeight: '500',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  socialButtonContainer: {
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
  orText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  inputField: {
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 30,
  },
  datePickerLabel: {
    color: '#666',
    marginLeft: 5,
    marginTop: 5,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  registerLink: {
    color: '#AD40AF',
    fontWeight: '700',
  },
});
