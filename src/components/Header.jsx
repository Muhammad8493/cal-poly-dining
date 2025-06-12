// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ isLoggedIn, onSignOut, isAdmin }) {
  const navigate = useNavigate();

  function handleSignInClick() {
    navigate('/sign-in');
  }

  return (
    <header className="bg-[#333333] text-[#ffffff] flex items-center justify-between px-4 py-2 whitespace-nowrap overflow-hidden">
      <div className="flex items-center gap-1">
        <Link to="/" className="text-3xl text-[#ffffff]">
          &#8962;
        </Link>
        <h1 className="hidden sm:block text-lg font-bold">Cal Poly Dining Reviews</h1>
      </div>

      <nav className="flex gap-2 sm:gap-4 text-sm sm:text-base">
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
        {isLoggedIn && (
          <Link
            to="/profile"
            className="text-[#bada55] hover:text-[#ffffff] font-bold transition-colors"
          >
            Profile
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin"
            className="text-[#bada55] hover:text-[#ffffff] font-bold transition-colors"
          >
            Admin
          </Link>
        )}
      </nav>

      {isLoggedIn ? (
        <button
          onClick={onSignOut}
          className="bg-[#bada55] text-[#333333] px-2 sm:px-3 py-1 rounded font-bold text-sm sm:text-base hover:bg-[#ffffff] hover:text-[#333333] transition-all"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={handleSignInClick}
          className="bg-[#bada55] text-[#333333] px-2 sm:px-3 py-1 rounded font-bold text-sm sm:text-base hover:bg-[#ffffff] hover:text-[#333333] transition-all"
        >
          Sign In
        </button>
      )}
    </header>
  );
}
