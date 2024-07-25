// src/consts/MessageNotificationListener.js
import { useEffect, useContext } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { FIRESTORE_DB } from './FirebaseConfig';
import { UserContext } from './UserContext';

export function useMessageNotificationListener() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(FIRESTORE_DB, 'messages'),
        where('recipientId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Snapshot received for messages');
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newMessage = change.doc.data();
            console.log('New message detected:', newMessage);
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'New Message Received',
                body: `You have a new message from ${newMessage.senderName}`,
              },
              trigger: null,
            });
          }
        });
      });

      return () => {
        console.log('Unsubscribed from messages updates');
        unsubscribe();
      };
    }
  }, [user]);
}
