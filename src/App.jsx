// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Dish from './pages/Dish';
import SignIn from './pages/SignIn';
import Contact from './pages/Contact';
import Polls from './pages/Polls';
import AdminPage from './admin/AdminPage';
import Profile from './pages/Profile';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState('');
  const [userEmail,  setUserEmail]  = useState('');
  const [userRole,   setUserRole]   = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      setUserRole('');
      return;
    }
    async function fetchUserRole() {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const userDoc = await getDoc(doc(db, 'Users', uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || '');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    }
    fetchUserRole();
  }, [isLoggedIn]);

  const isAdmin = userRole === 'admin';

  function addReview(spotId, dishId, newReview) {
    return addDoc(
      collection(db, 'DiningSpots', spotId, 'MenuItems', dishId, 'Reviews'),
      {
        ...newReview,
        createdAt: serverTimestamp(),
        flagged: false,
      }
    );
  }

  function handleSignOut() {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setUserRole('');
    auth.signOut().catch(console.error);
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header
          isLoggedIn={isLoggedIn}
          onSignOut={handleSignOut}
          isAdmin={isAdmin}
        />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/polls"
              element={
                <Polls
                  isLoggedIn={isLoggedIn}
                  currentUserEmail={userEmail}
                />
              }
            />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/sign-in"
              element={
                <SignIn
                  setIsLoggedIn={setIsLoggedIn}
                  setUserName={setUserName}
                  setUserEmail={setUserEmail}
                />
              }
            />

            <Route path="/restaurant/:name" element={<Restaurant />} />
            <Route
              path="/restaurant/:name/dish/:dishName"
              element={
                <Dish
                  addReview={addReview}
                  isLoggedIn={isLoggedIn}
                  userName={userName}
                  userEmail={userEmail}
                />
              }
            />

            <Route
              path="/profile"
              element={
                <Profile
                  isLoggedIn={isLoggedIn}
                  currentUserEmail={userEmail}
                />
              }
            />

            <Route
              path="/admin"
              element={
                isAdmin
                  ? <AdminPage />
                  : <div className="p-6 text-center">Not Authorized</div>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
