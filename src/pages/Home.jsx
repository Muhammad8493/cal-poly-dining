// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [vistaGrandeSpots, setVistaGrandeSpots] = useState([]);
  const [marketplaceSpots, setMarketplaceSpots] = useState([]);
  const [otherSpots, setOtherSpots] = useState([]);


  useEffect(() => {
    async function fetchDiningSpots() {
      try {
        const spotsRef = collection(db, 'DiningSpots');

        const vistaQuery = query(spotsRef, where('location', '==', 'Vista Grande'));
        const marketplaceQuery = query(spotsRef, where('location', '==', '1901 Marketplace'));
        const otherQuery = query(spotsRef, where('location', '==', 'Other'));

        const vistaSnapshot = await getDocs(vistaQuery);
        const marketplaceSnapshot = await getDocs(marketplaceQuery);
        const otherSnapshot = await getDocs(otherQuery);

        const vistaSpots = vistaSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const marketplaceSpots = marketplaceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const otherSpots = otherSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVistaGrandeSpots(vistaSpots);
        setMarketplaceSpots(marketplaceSpots);
        setOtherSpots(otherSpots);
      } catch (error) {
        console.error('Error fetching dining spots:', error);
      }
    }
    fetchDiningSpots();
  }, []);

  return (
    <>
      <Hero />
      <main className="w-[80%] max-w-[1100px] mx-auto my-10">
        <section className="mb-10">
          <h3 className="mb-4 text-xl border-b-2 border-[#bada55] inline-block pb-1">
            Vista Grande
          </h3>
          <div className="grid gap-5 grid-cols-1 min-[490px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1130px]:grid-cols-4 sm:justify-items-center">
          {vistaGrandeSpots.map(spot => (
              <Link to={`/restaurant/${spot.id}`} key={spot.id}>
<                   div className="bg-[#f9f9f9] border border-[#eeeeee] p-4 rounded hover:shadow-md transition-shadow cursor-pointer w-full sm:w-auto sm:text-center text-left">
                  <img
                    src={spot.image || 'https://place-hold.it/300'}
                    alt={spot.name}
                    className="w-58 mb-2 pl-1 pr-1"
                  />
                  <div className="font-bold text-[#333333] text-left text-sm sm:text-base pl-1">{spot.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="mb-4 text-xl border-b-2 border-[#bada55] inline-block pb-1">
            1901 Marketplace
          </h3>
          <div className="grid gap-5 grid-cols-1 min-[490px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1130px]:grid-cols-4 sm:justify-items-center">
            {marketplaceSpots.map(spot => (
              <Link to={`/restaurant/${spot.id}`} key={spot.id}>
                <div className="bg-[#f9f9f9] border border-[#eeeeee] p-4 rounded hover:shadow-md transition-shadow cursor-pointer w-full sm:w-auto sm:text-center text-left">
                  <img
                    src={spot.image || 'https://place-hold.it/300'}
                    alt={spot.name}
                    className="w-58 mb-2 pl-1 pr-1"
                  />
                  <div className="font-bold text-[#333333] text-left text-sm sm:text-base pl-1">{spot.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section >
          <h3 className="mb-4 text-xl border-b-2 border-[#bada55] inline-block pb-1">
            Other
          </h3>
          <div className="grid gap-5 grid-cols-1 min-[490px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1130px]:grid-cols-4 sm:justify-items-center">
            {otherSpots.map(spot => (
              <Link to={`/restaurant/${spot.id}`} key={spot.id}>
                <div className="bg-[#f9f9f9] border border-[#eeeeee] p-4 rounded hover:shadow-md transition-shadow cursor-pointer w-full sm:w-auto sm:text-center text-left">
                  <img
                    src={spot.image || 'https://place-hold.it/300'}
                    alt={spot.name}
                    className="w-58 mb-2 pl-1 pr-1"
                  />
                  <div className="font-bold text-[#333333] text-left text-sm sm:text-base pl-1">{spot.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>


      </main>
    </>
  );
}
