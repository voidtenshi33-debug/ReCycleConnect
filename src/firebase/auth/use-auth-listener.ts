
'use client';

import { useEffect } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export function useAuthListener() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      
      getDoc(userRef).then(docSnap => {
        if (!docSnap.exists()) {
          // New user, create profile
          const profileData = {
            userId: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastKnownLocality: 'kothrud', // Default location
          };
          setDoc(userRef, profileData, { merge: true }).catch((e) => {
            console.error("Error creating user profile:", e);
          });
        } else {
          // Existing user, ensure displayName and photoURL from provider are updated if empty
          const existingData = docSnap.data();
          const updates: { displayName?: string | null, photoURL?: string | null } = {};
          
          if (!existingData.displayName && user.displayName) {
            updates.displayName = user.displayName;
          }
          if (!existingData.photoURL && user.photoURL) {
            updates.photoURL = user.photoURL;
          }

          if (Object.keys(updates).length > 0) {
            setDoc(userRef, updates, { merge: true }).catch((e) => {
              console.error("Error updating user profile:", e);
            });
            // also update auth profile if it was missing info
            if (auth.currentUser) {
              updateProfile(auth.currentUser, updates).catch((e) => {
                 console.error("Error updating auth profile:", e);
              });
            }
          }
        }
      }).catch(e => {
         console.error("Error checking user profile:", e);
      })
    }
  }, [user, firestore, auth]);

  return { user };
}
