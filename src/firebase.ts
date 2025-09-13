// Import the functions you need from the SDKs you need
// FIX: The modular imports from 'firebase/firestore' were failing.
// Switched to Firebase v9 compat imports to support the v8 syntax,
// which seems to be what the project environment is configured for.
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA60woZOdULJq0uPQDZusKhKoTphABv-Hc",
  authDomain: "meta-yoga.firebaseapp.com",
  projectId: "meta-yoga",
  storageBucket: "meta-yoga.firebasestorage.app",
  messagingSenderId: "444105687223",
  appId: "1:444105687223:web:cfac4feea9ec4fa1efcd32",
  measurementId: "G-GLCD6TM3QQ"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const firestore = firebase.firestore();
