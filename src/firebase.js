// src/firebase.js
// import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// dotenv.config();


// Your Firebase configuration from environment variables
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
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Create a Google auth provider instance
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, analytics, googleProvider };
