// src/components/ReviewModal.jsx
import React, { useState } from 'react';

export default function ReviewModal({
  onClose,
  addReview,
  onReviewAdded,
  restaurantName,
  dishName,
  userName,
  userEmail,
  renderStars
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newReview = {
      title,
      comment: body,
      rating,
      name: userName,
      email: userEmail,
      likedBy:[],
      dislikedBy:[]
    };

    // addReview is expected to return a promise that resolves with the DocumentReference.
    addReview(restaurantName, dishName, newReview)
      .then((docRef) => {
        // Set the review object's id from Firestore.
        newReview.id = docRef.id;
        if (onReviewAdded) {
          onReviewAdded(newReview);
        }
        // Clear form and close modal.
        setTitle('');
        setBody('');
        setRating(5);
        setIsSubmitting(false);
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        setIsSubmitting(false);
      });
  };

  const handleBodyChange = (e) => {
    if (e.target.value.length <= 250) {
      setBody(e.target.value);
    }
  };

  // Clicking on the overlay closes the modal.
  const handleOverlayClick = () => {
    onClose();
  };

  // Render clickable star rating (1-5)
  const renderClickableStars = () => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <span
            key={starValue}
            onClick={() => setRating(starValue)}
            className={`cursor-pointer text-2xl ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            style={{ WebkitTextStroke: '0.5px black' }}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-700">{rating}</span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2.5"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
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
            <div className="text-sm text-gray-500">{body.length}/250 characters</div>
          </div>
          {/* Star Rating: Clickable Stars */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Your Rating</label>
            {renderClickableStars()}
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
