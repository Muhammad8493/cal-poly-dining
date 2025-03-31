// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [vistaGrandeSpots, setVistaGrandeSpots] = useState([]);
  const [marketplaceSpots, setMarketplaceSpots] = useState([]);

  useEffect(() => {
    async function fetchDiningSpots() {
      try {
        const spotsRef = collection(db, 'DiningSpots');

        const vistaQuery = query(spotsRef, where('location', '==', 'Vista Grande'));
        const marketplaceQuery = query(spotsRef, where('location', '==', '1901 Marketplace'));

        const vistaSnapshot = await getDocs(vistaQuery);
        const marketplaceSnapshot = await getDocs(marketplaceQuery);

        const vistaSpots = vistaSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const marketplaceSpots = marketplaceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVistaGrandeSpots(vistaSpots);
        setMarketplaceSpots(marketplaceSpots);
      } catch (error) {
        console.error('Error fetching dining spots:', error);
      }
    }
    fetchDiningSpots();
  }, []);

  return (
    <>
      <Hero />
      <main className="w-[90%] max-w-[1200px] mx-auto my-10">
        <section className="mb-10">
          <h3 className="mb-4 text-xl border-b-2 border-[#bada55] inline-block pb-1">
            Vista Grande
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {vistaGrandeSpots.map(spot => (
              <Link to={`/restaurant/${spot.id}`} key={spot.id}>
                <div className="bg-[#f9f9f9] border border-[#eeeeee] text-center p-4 rounded hover:shadow-md transition-shadow cursor-pointer">
                  <img
                    src={spot.image || 'https://place-hold.it/300'}
                    alt={spot.name}
                    className="w-58 mb-2 pl-1"
                  />
                  <div className="font-bold text-[#333333] text-left pl-1">{spot.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-xl border-b-2 border-[#bada55] inline-block pb-1">
            1901 Marketplace
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {marketplaceSpots.map(spot => (
              <Link to={`/restaurant/${spot.id}`} key={spot.id}>
                <div className="bg-[#f9f9f9] border border-[#eeeeee] text-center p-4 rounded hover:shadow-md transition-shadow cursor-pointer">
                  <img
                    src={spot.image || 'https://place-hold.it/300'}
                    alt={spot.name}
                    className="w-58 mb-2 pl-1"
                  />
                  <div className="font-bold text-[#333333] text-left pl-1">{spot.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
