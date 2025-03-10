// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

export default function Home() {
  const vistaGrandeSpots = ['Brunch', 'Streets', 'Hearth', 'Noodles', 'Balance', 'Nosh'];
  const marketplaceSpots = ['Red Radish', 'Picos', 'Pom & Honey', 'Poly Deli', 'Julian\'s Cafe'];

  return (
    <>
      {/* 1) Hero on Home page only */}
      <Hero />

      <main className="w-[90%] max-w-[1200px] mx-auto my-10">
        {/* Vista Grande Section */}
        <section className="mb-10">
          <h3 className="mb-4 text-xl border-b-2 border-[#bada55] inline-block pb-1">
            Vista Grande
          </h3>
          {/* 2) 3 columns max */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {vistaGrandeSpots.map(spot => (
              <Link to={`/restaurant/${spot}`} key={spot}>
                <div className="bg-[#f9f9f9] border border-[#eeeeee] text-center p-4 rounded 
                                hover:shadow-md transition-shadow cursor-pointer">
                  <img
                    src="https://place-hold.it/300"
                    alt={spot}
                    className="w-58 mb-2 pl-1"
                  />
                  <div className="font-bold text-[#333333] text-left pl-1">{spot}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 1901 Marketplace Section */}
        <section>
          <h3 className="mb-4 text-xl border-b-2 border-[#bada55] inline-block pb-1">
            1901 Marketplace
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {marketplaceSpots.map(spot => (
              <Link to={`/restaurant/${spot}`} key={spot}>
                <div className="bg-[#f9f9f9] border border-[#eeeeee] text-center p-4 rounded
                                hover:shadow-md transition-shadow cursor-pointer">
                  <img
                    src="https://place-hold.it/300"
                    alt={spot}
                    className="w-58 mb-2 pl-1"
                  />
                  <div className="font-bold text-[#333333] text-left pl-1">{spot}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
