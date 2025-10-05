'use client';

import { useEffect } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export function useAuthListener() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      setDoc(
        userRef,
        {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      ).catch((e) => {
        console.error("Error creating user profile:", e);
      });
    }
  }, [user, firestore]);

  return { user };
}
