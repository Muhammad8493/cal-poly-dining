// src/components/Hero.jsx
import React from 'react';

export default function Hero() {
  return (
    <div
      className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] flex items-center justify-center text-white text-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://calpolypartners.org/wp-content/uploads/2020/10/Vista-Grande_6491-web-1080x675.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 px-4">
        <h2 className="text-2xl sm:text-4xl font-bold mb-2">Cal Poly Dining Reviews</h2>
        <p className="text-md sm:text-xl">Rate, Review, and Improve Your Campus Dining Experience</p>
      </div>
    </div>
  );
}
