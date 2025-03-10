// src/components/ReviewModal.jsx
import React, { useState } from 'react';

export default function ReviewModal({
  onClose,
  addReview,
  restaurantName,
  dishName,
  userName,
  renderStars
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true);
    
    // Create new review object using the actual userName
    const newReview = {
      id: Date.now(),
      title,
      body,
      rating,
      user: userName,
    };
    
    // Add the review through the parent's function
    addReview(restaurantName, dishName, newReview);
    
    // Clear the form and close the modal
    setTitle('');
    setBody('');
    setRating(5);
    setIsSubmitting(false);
    onClose();
  }

  // Limit body to 250 characters
  function handleBodyChange(e) {
    if (e.target.value.length <= 250) {
      setBody(e.target.value);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmit}>
          {/* Review Title */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Review Title</label>
            <input
              type="text"
              className="border border-gray-300 w-full p-2 rounded focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Awesome dish!"
              required
            />
          </div>
          {/* Review Body */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Your Review</label>
            <textarea
              className="border border-gray-300 w-full p-2 rounded focus:outline-none"
              rows="4"
              value={body}
              onChange={handleBodyChange}
              placeholder="What did you think?"
              required
            />
            <div className="text-sm text-gray-500">
              {body.length}/250 characters
            </div>
          </div>
          {/* Star Rating */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Your Rating</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
              />
              <span className="text-sm text-gray-700">
                {renderStars(rating)}
              </span>
              <span className="text-sm text-gray-700 ml-2">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#bada55] text-[#333333] px-4 py-2 rounded font-bold hover:bg-[#ffffff] hover:text-[#333333] transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
