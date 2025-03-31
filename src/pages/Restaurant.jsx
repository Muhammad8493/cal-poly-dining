// src/pages/Restaurant.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function Restaurant() {
  const { name } = useParams(); // Here 'name' is the document ID of the dining spot
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    async function fetchRestaurantAndMenuItems() {
      try {
        // Fetch the restaurant details.
        const restaurantRef = doc(db, 'DiningSpots', name);
        const restaurantSnap = await getDoc(restaurantRef);
        if (restaurantSnap.exists()) {
          setRestaurant({ id: restaurantSnap.id, ...restaurantSnap.data() });
        }

        // Fetch menu items.
        const menuRef = collection(db, 'DiningSpots', name, 'MenuItems');
        const menuSnapshot = await getDocs(menuRef);
        const items = await Promise.all(
          menuSnapshot.docs.map(async (docSnap) => {
            const dish = { id: docSnap.id, ...docSnap.data() };

            // For each dish, fetch its reviews.
            const reviewsRef = collection(db, 'DiningSpots', name, 'MenuItems', dish.id, 'Reviews');
            const reviewsSnapshot = await getDocs(reviewsRef);
            const reviews = reviewsSnapshot.docs.map(rDoc => rDoc.data());
            const reviewCount = reviews.length;
            let averageRating = 0;
            if (reviewCount > 0) {
              averageRating =
                reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviewCount;
            }
            // Add calculated values to the dish object.
            return { ...dish, averageRating, reviewCount };
          })
        );
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching restaurant or menu items:', error);
      }
    }
    fetchRestaurantAndMenuItems();
  }, [name]);

  function handleBackClick() {
    navigate(-1);
  }

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-5">
      <div className="flex flex-col">
        <button
          onClick={handleBackClick}
          className="bg-[#bada55] text-[#333333] px-3 py-1 rounded font-bold hover:bg-[#ffffff] hover:text-[#333333] transition-colors mb-2 self-start"
        >
          &larr; Back
        </button>
        <h2 className="text-2xl font-bold border-b-2 border-[#bada55] inline-block pb-1 mb-6">
          {restaurant ? restaurant.name : 'Loading...'}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems.map(dish => (
          <Link key={dish.id} to={`/restaurant/${name}/dish/${dish.id}`}>
            <div className="bg-[#f9f9f9] border border-[#eeeeee] p-4 rounded hover:shadow-md transition-shadow text-center cursor-pointer">
              <img
                src={dish.image || 'https://place-hold.it/300'}
                alt={dish.name}
                className="w-52 mb-2"
              />
              <div className="font-bold text-[#333333] text-left">{dish.name}</div>
              {/* Display average rating and number of reviews */}
              <div className="text-sm text-gray-600 text-left">
                <>
                  Rating: {dish.averageRating.toFixed(1)}
                </>
              </div>
              <div className="text-sm text-gray-600 text-left">
                {dish.reviewCount ? (
                  <>
                    {dish.reviewCount} Review
                    {dish.reviewCount > 1 ? 's' : ''}
                  </>
                ) : (
                  'No reviews yet'
                )}
              </div>
              <p className="text-sm text-gray-600 text-left">{dish.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
