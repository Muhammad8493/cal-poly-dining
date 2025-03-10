// src/pages/DiningSpots.jsx
import React from 'react';

export default function DiningSpots() {
  return (
    <main>
      {/* Simple hero-like banner */}
      <section className="bg-[#f0f0f0] py-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Discover Dining Locations on Campus</h1>
        <p className="text-md">Find your next meal and see what others are saying.</p>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Example dining spot */}
            <div className="bg-[#ffffff] border border-[#eeeeee] p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Streats</h2>
              <p className="text-sm mb-4">Bowls and Wraps</p>
              <a
                href="#"
                className="inline-block px-4 py-2 bg-[#bada55] text-[#333333] rounded
                           hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
              >
                View Menu
              </a>
            </div>

            {/* Another dining spot */}
            <div className="bg-[#ffffff] border border-[#eeeeee] p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Red Radish</h2>
              <p className="text-sm mb-4">Salad and Wraps</p>
              <a
                href="#"
                className="inline-block px-4 py-2 bg-[#bada55] text-[#333333] rounded
                           hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
              >
                View Menu
              </a>
            </div>

            <div className="bg-[#ffffff] border border-[#eeeeee] p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Brunch</h2>
              <p className="text-sm mb-4">Breakfast</p>
              <a
                href="#"
                className="inline-block px-4 py-2 bg-[#bada55] text-[#333333] rounded
                           hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
              >
                View Menu
              </a>
            </div>

            {/* Another dining spot */}
            <div className="bg-[#ffffff] border border-[#eeeeee] p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Balance</h2>
              <p className="text-sm mb-4">Healthy Breakfast</p>
              <a
                href="#"
                className="inline-block px-4 py-2 bg-[#bada55] text-[#333333] rounded
                           hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
              >
                View Menu
              </a>
            </div>

            <div className="bg-[#ffffff] border border-[#eeeeee] p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Nosh</h2>
              <p className="text-sm mb-4">Bowls and Wraps</p>
              <a
                href="#"
                className="inline-block px-4 py-2 bg-[#bada55] text-[#333333] rounded
                           hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
              >
                View Menu
              </a>
            </div>

            {/* Another dining spot */}
            <div className="bg-[#ffffff] border border-[#eeeeee] p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Noodles</h2>
              <p className="text-sm mb-4">Pasta</p>
              <a
                href="#"
                className="inline-block px-4 py-2 bg-[#bada55] text-[#333333] rounded
                           hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
              >
                View Menu
              </a>
            </div>

            <div className="bg-[#ffffff] border border-[#eeeeee] p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Picos</h2>
              <p className="text-sm mb-4">Bowls and Wraps</p>
              <a
                href="#"
                className="inline-block px-4 py-2 bg-[#bada55] text-[#333333] rounded
                           hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
              >
                View Menu
              </a>
            </div>

            {/* Another dining spot */}
            <div className="bg-[#ffffff] border border-[#eeeeee] p-4 rounded">
              <h2 className="text-xl font-bold mb-2">45 North</h2>
              <p className="text-sm mb-4">American Grill & Burgers</p>
              <a
                href="#"
                className="inline-block px-4 py-2 bg-[#bada55] text-[#333333] rounded
                           hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
              >
                View Menu
              </a>
            </div>

            {/* Add more spots as needed */}
          </div>
        </div>
      </section>
    </main>
  );
}
