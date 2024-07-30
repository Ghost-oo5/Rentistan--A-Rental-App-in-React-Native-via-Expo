// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { FIRESTORE_DB, FIREBASE_Auth } from './FirebaseConfig'; // Adjust the path as needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileType, setProfileType] = useState('renter'); // Default to 'renter'

  useEffect(() => {
    const unsubscribeAuth = FIREBASE_Auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const userDocRef = doc(FIRESTORE_DB, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfileType(userData.profileType || 'renter'); // Set profile type from Firestore
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const switchProfileType = async (newProfileType) => {
    if (user && user.uid) {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        await updateDoc(userDocRef, { profileType: newProfileType });
        setProfileType(newProfileType);
      } catch (error) {
        console.error("Error updating profile type:", error);
      }
    } else {
      console.warn("No user is currently authenticated.");
    }
  };

  return (
    <UserContext.Provider value={{ user, profileType, switchProfileType }}>
      {children}
    </UserContext.Provider>
  );
};
