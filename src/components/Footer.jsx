// src/components/Footer.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function Footer() {
  return (
    <footer className="bg-[#333333] text-[#ffffff] flex items-center justify-between p-4">
      <div className="text-xs sm:text-sm">Cal Poly Dining Reviews</div>
      <nav className="flex gap-4 text-sm sm:text-base">
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
    </footer>
  );
}
