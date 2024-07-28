import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// This line is necessary for Expo to handle the redirect properly
WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '703190687390-m28qpv1qvluhel2c6gkbn219kefv0rmm.apps.googleusercontent.com'; // Replace with your Google Client ID

const googleAuthConfig = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: CLIENT_ID,
    iosClientId: CLIENT_ID,
    androidClientId: CLIENT_ID,
    webClientId: CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Use authentication to sign in with Firebase
    }
  }, [response]);

  return { promptAsync };
};

export default googleAuthConfig;
