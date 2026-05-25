// Firebase configuration and initialization
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD90_Q5cxUOCkaKkfvqcLUhJb1C0HLLD2w",
  authDomain: "projetomari-71cb9.firebaseapp.com",
  projectId: "projetomari-71cb9",
  storageBucket: "projetomari-71cb9.firebasestorage.app",
  messagingSenderId: "674889744853",
  appId: "1:674889744853:web:01a68a92f7cc51e2d83d5c"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;