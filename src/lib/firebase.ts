import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyCogZZlCKBB5kWF6tq3UeHgyS16yAKE81c",
  authDomain: "todomaster-ed26e.firebaseapp.com",
  projectId: "todomaster-ed26e",
  storageBucket: "todomaster-ed26e.firebasestorage.app",
  messagingSenderId: "99959309820",
  appId: "1:99959309820:web:b947954dd3df0d6a295e79",
  measurementId: "G-LC2N5DL44G"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;