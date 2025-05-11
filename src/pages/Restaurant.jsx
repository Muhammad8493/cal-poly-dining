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
<div className="w-[90%] max-w-[1200px] mx-auto my-3 max-[600px]:my-2">
  {/* Back button and Restaurant image in one row */}
  <div className="flex items-center mb-1 max-[6000px]:mb-0">
    <button
      onClick={handleBackClick}
      className="bg-[#bada55] text-[#333333] px-3 py-1.5 rounded font-bold hover:bg-[#ffffff] hover:text-[#333333] transition-colors text-sm max-[600px]:text-xs"
    >
      &larr; Back
    </button>
    {restaurant && restaurant.image && (
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-12 h-12 rounded ml-4 object-cover max-[600px]:w-11 max-[600px]:h-11"
      />
    )}
  </div>
  {/* Restaurant name */}
  <div className="mb-6 max-[600px]:mb-3">
    <h2 className="text-2xl max-[490px]:text-xl font-bold border-b-2 border-[#bada55] pb-1">
      {restaurant ? restaurant.name : 'Loading...'}
    </h2>
  </div>
        <div
        className="grid grid-cols-1 gap-5 min-[600px]:grid-cols-2 min-[800px]:grid-cols-3
                    min-[1100px]:grid-cols-4 auto-rows-fr min-[600px]:justify-items-center">
        {menuItems.map(dish => (
          <Link key={dish.id} to={`/restaurant/${name}/dish/${dish.id}`}>
            <div
              className="bg-[#f9f9f9] border border-[#eeeeee] rounded hover:shadow-md transition-shadow cursor-pointer
                          flex flex-row items-center gap-4 w-full p-4 text-left min-[600px]:flex-col  min-[600px]:items-start               
                          min-[600px]:w-auto    min-[600px]:max-w-[264px] min-[600px]:mx-auto h-full">
              <img
                src={dish.image || 'https://place-hold.it/300'}
                alt={dish.name}
                className="w-20 h-20 aspect-square object-cover rounded min-[600px]:w-58  min-[600px]:h-58  min-[600px]:mx-auto" />

              <div className="flex flex-col text-left text-sm w-full"> 
                <div className="font-bold text-[#333333]">{dish.name}</div>

                <div className="text-gray-600">Rating:&nbsp;{dish.averageRating.toFixed(1)}</div>
                <div className="text-gray-600">
                  {dish.reviewCount ? (
                    <>
                      {dish.reviewCount} Review{dish.reviewCount > 1 ? 's' : ''}
                    </>
                  ) : (
                    'No reviews yet'
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
