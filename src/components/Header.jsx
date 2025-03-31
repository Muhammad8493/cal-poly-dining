// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ isLoggedIn, onSignOut }) {
  const navigate = useNavigate();

  function handleSignInClick() {
    navigate('/sign-in');
  }

  return (
    <header className="bg-[#333333] text-[#ffffff] flex items-center justify-between px-4 py-2">
      {/* Home button (larger icon) */}
      <div className="flex items-center">
        <Link to="/" className="mr-2 text-3xl text-[#ffffff]">
          &#8962;
        </Link>
        <h1 className="text-lg font-bold">Cal Poly Dining Reviews</h1>
      </div>

      {/* Navigation links */}
      <nav className="flex gap-4">
        {/* <Link
          to="/dining-spots"
          className="text-[#bada55] hover:text-[#ffffff] font-bold transition-colors"
        >
          Dining
        </Link> */}
        {/* <Link
          to="#"
          className="text-[#bada55] hover:text-[#ffffff] font-bold transition-colors"
        >
          Reviews
        </Link> */}
        <Link
          to="/polls"
          className="text-[#bada55] hover:text-[#ffffff] font-bold transition-colors"
        >
          Polls
        </Link>
        <Link
          to="/contact"
          className="text-[#bada55] hover:text-[#ffffff] font-bold transition-colors"
        >
          Contact
        </Link>
      </nav>

      {/* Conditional Sign In / Sign Out */}
      {isLoggedIn ? (
        <button
          onClick={onSignOut}
          className="bg-[#bada55] text-[#333333] px-3 py-1 rounded font-bold
                     hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={handleSignInClick}
          className="bg-[#bada55] text-[#333333] px-3 py-1 rounded font-bold
                     hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
        >
          Sign In
        </button>
      )}
    </header>
  );
}
