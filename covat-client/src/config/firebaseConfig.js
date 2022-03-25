// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBaUgJ1a1Bs5vJGfCM_pcUy9xnA0hmKACI',
  authDomain: 'covat-3bd0b.firebaseapp.com',
  databaseURL:
    'https://covat-3bd0b-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'covat-3bd0b',
  storageBucket: 'covat-3bd0b.appspot.com',
  messagingSenderId: '897307989553',
  appId: '1:897307989553:web:e8aca0514efe2fbb856710',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
