// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-[#ffffff] flex items-center justify-between p-4">
      <div className="text-sm">Cal Poly Dining Reviews</div>
      <nav className="flex gap-4">
        <a href="#" className="text-[#bada55] hover:text-[#ffffff] transition-colors">Dining</a>
        <a href="#" className="text-[#bada55] hover:text-[#ffffff] transition-colors">Reviews</a>
        <a href="#" className="text-[#bada55] hover:text-[#ffffff] transition-colors">Polls</a>
        <a href="#" className="text-[#bada55] hover:text-[#ffffff] transition-colors">Contact</a>
      </nav>
    </footer>
  );
}
