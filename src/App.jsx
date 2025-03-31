// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Dish from './pages/Dish';
import SignIn from './pages/SignIn';
import DiningSpots from './pages/DiningSpots';
import Contact from './pages/Contact';
import Polls from './pages/Polls';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Removed hardcoded dishData.
  // Dish.jsx will fetch its own data from Firestore.

  // Helper function to add a new review to a dish's Reviews subcollection.
  function addReview(restaurantName, dishName, newReview) {
    return addDoc(
        collection(db, 'DiningSpots', restaurantName, 'MenuItems', dishName, 'Reviews'),
        {
          ...newReview,
          createdAt: serverTimestamp(),
          flagged: false,
        }
      )
        .then(() => {
          // Optionally notify success or update local state.
        })
        .catch((error) => {
          console.error('Error adding review:', error);
        });
  }

  function handleSignOut() {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dining-spots" element={<DiningSpots />} />
            <Route path="/polls" element={<Polls isLoggedIn={isLoggedIn} currentUserEmail={userEmail} />} />
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
                />
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
