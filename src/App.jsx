// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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


  const [dishData, setDishData] = useState({
    Brunch: {
      Burger: [
        { id: 1, title: 'Good dish!', body: 'Delicious!', rating: 4, user: 'John Doe' },
        { id: 2, title: 'Pretty good!', body: 'Tasted great!', rating: 4.5, user: 'Jane Smith' },
        { id: 3, title: 'Decent', body: 'It was okay.', rating: 3.5, user: 'Alex Johnson' },
        { id: 4, title: 'Loved it!', body: 'One of the best meals!', rating: 4.0, user: 'Chris Lee' },
      ],
      Salad: [
        { id: 1, title: 'Light and fresh', body: 'Loved the dressing!', rating: 4.0, user: 'Sam Green' },
      ],
    },
    // You can add more restaurants and dishes as needed
  });

  // Helper function to add a new review for a given restaurant + dish
  function addReview(restaurantName, dishName, newReview) {
    setDishData(prev => {
      // Make a shallow copy
      const newState = { ...prev };
      // Ensure we have an object for that restaurant
      if (!newState[restaurantName]) {
        newState[restaurantName] = {};
      }
      // Ensure we have an array for that dish
      if (!newState[restaurantName][dishName]) {
        newState[restaurantName][dishName] = [];
      }
      // Append the new review
      newState[restaurantName][dishName] = [
        ...newState[restaurantName][dishName],
        newReview
      ];
      return newState;
    });
  }

  function handleSignOut() {
    setIsLoggedIn(false);
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dining-spots" element={<DiningSpots />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/sign-in"
              element={<SignIn setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />}
            />
            <Route path="/restaurant/:name" element={<Restaurant />} />
            {/* Pass dishData, addReview, isLoggedIn, userName to Dish */}
            <Route
              path="/restaurant/:name/dish/:dishName"
              element={
                <Dish
                  dishData={dishData}
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
