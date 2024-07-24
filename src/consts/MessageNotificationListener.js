import { useEffect, useContext } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { UserContext } from './UserContext';

export function useListingNotificationListener() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(FIRESTORE_DB, 'rentals'),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Snapshot received for rentals');
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newListing = change.doc.data();
            console.log('New listing detected:', newListing);

            try {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: 'New Listing Added',
                  body: `A new listing has been added: ${newListing.title}`,
                },
                trigger: null,
              });
              console.log('Notification scheduled');
            } catch (error) {
              console.error('Error scheduling notification:', error);
            }
          }
        });
      });

      return () => {
        console.log('Unsubscribed from rentals updates');
        unsubscribe();
      };
    }
  }, [user]);
}
