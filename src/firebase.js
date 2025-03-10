// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc0FIHMv2K7JayBw_5rVz02dSGiaHHpqM",
  authDomain: "cal-poly-dining.firebaseapp.com",
  projectId: "cal-poly-dining",
  storageBucket: "cal-poly-dining.firebasestorage.app",
  messagingSenderId: "237207089060",
  appId: "1:237207089060:web:0323c41c8d9321c4cc9b31",
  measurementId: "G-LTX7KTW5Y4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const analytics = getAnalytics(app); 

export{app, auth}