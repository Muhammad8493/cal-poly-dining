// src/pages/Dish.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function Dish({ isLoggedIn, userName, addReview }) {
  const { name, dishName } = useParams(); // 'name' is dining spot ID, 'dishName' is menu item ID
  const navigate = useNavigate();
  const location = useLocation();
  const [dishDetails, setDishDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleBackClick() {
    navigate(-1);
  }

  function renderStars(rating) {
    if (typeof rating !== 'number' || isNaN(rating)) return null;
    const fullStars = Math.floor(rating);
    const fraction = rating % 1;
    const hasHalfStar = fraction > 0.2 && fraction < 0.8;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="flex">
        {Array(fullStars).fill().map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-lg" style={{ WebkitTextStroke: '.5px black' }}>★</span>
        ))}
        {hasHalfStar && (
          <span className="text-yellow-100 text-lg" style={{ WebkitTextStroke: '.5px black' }}>★</span>
        )}
        {Array(emptyStars).fill().map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-lg" style={{ WebkitTextStroke: '.5px black' }}>★</span>
        ))}
      </div>
    );
  }

  function getInitials(name) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  useEffect(() => {
    async function fetchDish() {
      try {
        const dishRef = doc(db, 'DiningSpots', name, 'MenuItems', dishName);
        const dishSnap = await getDoc(dishRef);
        if (dishSnap.exists()) {
          setDishDetails({ id: dishSnap.id, ...dishSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching dish:', error);
      }
    }
    async function fetchReviews() {
      try {
        const reviewsRef = collection(db, 'DiningSpots', name, 'MenuItems', dishName, 'Reviews');
        const reviewsSnapshot = await getDocs(reviewsRef);
        const reviewsData = reviewsSnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    fetchDish();
    fetchReviews();
  }, [name, dishName]);

  function handleWriteReviewClick() {
    if (!isLoggedIn) {
      navigate('/sign-in', { state: { from: location } });
    } else {
      setIsModalOpen(true);
    }
  }

  // Compute average rating from reviews.
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
    : 0;

  // Callback to update local reviews state when a new review is added.
  function handleReviewAdded(newReview) {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  }

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-5">
      <button
        onClick={handleBackClick}
        className="bg-[#bada55] text-[#333333] px-3 py-1 rounded font-bold hover:bg-[#ffffff] hover:text-[#333333] transition-colors mb-4"
      >
        &larr; Back
      </button>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {dishDetails && (
          <img
            src={dishDetails.image || 'https://place-hold.it/300'}
            alt={dishDetails.name}
            className="w-full md:w-1/3 h-auto object-cover"
          />
        )}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-2">
            {dishDetails ? dishDetails.name : 'Loading...'}
          </h2>
          {/* Dish description immediately below the name */}
          <p className="mb-2">
            {dishDetails ? dishDetails.description : ''}
          </p>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(Number(averageRating))}
            <span className="text-sm text-gray-600">
              {averageRating ? averageRating.toFixed(1) : 'No ratings yet'}
            </span>
          </div>
          <p className="mb-2">Reviews: {reviews.length}</p>
          <button
            onClick={handleWriteReviewClick}
            className="bg-[#bada55] text-[#333333] px-3 py-1 rounded font-bold hover:bg-[#ffffff] hover:text-[#333333] transition-colors mt-4"
          >
            Write a Review
          </button>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Latest reviews</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {reviews.map(review => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 p-4 rounded shadow-sm flex flex-col justify-between"
          >
            <div className="mb-2 flex items-center gap-2">
              {renderStars(Number(review.rating))}
              <span className="text-sm text-gray-600">{review.rating}</span>
            </div>
            <div className="flex-grow">
              <h4 className="font-bold mb-1">{review.title}</h4>
              <p className="text-sm mb-2">{review.comment}</p>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm mr-2">
                {getInitials(review.name)}
              </div>
              <div className="text-gray-600 text-sm">{review.name}</div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <ReviewModal
          onClose={() => setIsModalOpen(false)}
          addReview={addReview}
          onReviewAdded={handleReviewAdded}
          restaurantName={name}
          dishName={dishName}
          userName={userName}
          renderStars={renderStars}
        />
      )}
    </div>
  );
}
