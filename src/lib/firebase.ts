import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  throw new Error('Missing Firebase configuration. Please check your environment variables.');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const handleFirestoreError = (error: any): string => {
  console.error('Firestore error:', error);
  if (error?.code === 'permission-denied') {
    return 'You do not have permission to perform this action';
  }
  return error?.message || 'An error occurred. Please try again.';
};

export { auth, db, handleFirestoreError };