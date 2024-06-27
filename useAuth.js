import { useEffect, useState } from 'react';
import { AUTH } from './FirebaseConfig'; // Adjust path as per your project structure

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = AUTH.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { user };
};
