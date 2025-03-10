// src/pages/Dish.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';  

export default function Dish({ dishData, addReview, isLoggedIn, userName }) {
  const { name, dishName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  function handleBackClick() {
    navigate(-1);
  }

  // Retrieve existing reviews from parent state
  const existingReviews = dishData[name]?.[dishName] || [];

  const dishDetails = {
    image: 'https://place-hold.it/300',
    description: `Description of the dish from ${name}. Here are some of the things this dish contains.`,
    rating: 4.3,
    reviews: existingReviews.length,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const fraction = rating % 1;
    const hasHalfStar = fraction > 0.2 && fraction < 0.8;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <span key={`full-${i}`} className="text-yellow-400 text-lg" style={{WebkitTextStroke: '.5px black'}}>★</span>
          ))}
        {hasHalfStar && <span className="text-yellow-100 text-lg"style={{WebkitTextStroke: '.5px black'}} >★</span>}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300 text-lg" style={{WebkitTextStroke: '.5px black'}}>★</span>
          ))}
      </div>
    );
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  function handleWriteReviewClick() {
    if (!isLoggedIn) {
      navigate('/sign-in', { state: { from: location } });
    } else {
      setIsModalOpen(true);
    }
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
        <img
          src={dishDetails.image}
          alt={dishName}
          className="w-full md:w-1/3 h-auto object-cover"
        />
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-2">{dishName}</h2>
          <p className="mb-2">{dishDetails.description}</p>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(dishDetails.rating)}
            <span className="text-sm text-gray-600">{dishDetails.rating}</span>
          </div>
          <p className="mb-2">Reviews: {dishDetails.reviews}</p>
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
        {existingReviews.map(review => (
          <div
            key={review.id}
            className="bg-white h-70 border border-gray-200 p-4 rounded shadow-sm flex flex-col justify-between"
          >
            <div className="mb-2 flex items-center gap-2">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600">{review.rating}</span>
            </div>
            <div className="flex-grow">
              <h4 className="font-bold mb-1">{review.title}</h4>
              <p className="text-sm mb-2">{review.body}</p>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm mr-2">
                {getInitials(review.user)}
              </div>
              <div className="text-gray-600 text-sm">{review.user}</div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ReviewModal
          onClose={() => setIsModalOpen(false)}
          addReview={addReview}
          restaurantName={name}
          dishName={dishName}
          userName={userName}
          renderStars={renderStars}
        />
      )}
    </div>
  );
}
