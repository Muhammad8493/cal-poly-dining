// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  collectionGroup,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';


export default function Profile({ isLoggedIn, currentUserEmail }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setReviews([]);
      setLoading(false);
      return;
    }

    async function fetchMyReviews() {
      setLoading(true);
      try {
        const q = query(
          collectionGroup(db, 'Reviews'),
          where('email', '==', currentUserEmail)
        );
        const snap = await getDocs(q);

        const enriched = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const pathSegments = docSnap.ref.path.split('/');
            const restaurantId = pathSegments[1];
            const dishId = pathSegments[3];

            let restaurantName = 'Unknown Restaurant';
            let dishName = 'Unknown Dish';

            try {
              const restSnap = await getDoc(doc(db, 'DiningSpots', restaurantId));
              if (restSnap.exists()) restaurantName = restSnap.data().name || restaurantName;
            } catch {}

            try {
              const dishSnap = await getDoc(doc(db, 'DiningSpots', restaurantId, 'MenuItems', dishId));
              if (dishSnap.exists()) dishName = dishSnap.data().name || dishName;
            } catch {}

            return {
              id: docSnap.id,
              path: docSnap.ref.path,
              restaurantId,
              dishId,
              restaurantName,
              dishName,
              ...data,
            };
          })
        );

        setReviews(enriched);
      } catch (err) {
        console.error('Error fetching your reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyReviews();
  }, [isLoggedIn, currentUserEmail]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  
  const openDeleteModal = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteDoc(doc(db, reviewToDelete.path));
      setReviews(prev => prev.filter(r => r.id !== reviewToDelete.id));
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete. Please try again.');
    }
  };
  

  const renderStars = r => {
    if (typeof r !== 'number' || isNaN(r)) return null;
    const full = Math.round(r);  // assume rating is 0–5 integer
    const empty = 5 - full;
    const starStyle = { WebkitTextStroke: '.5px black' };
  
    return (
      <div className="flex">
        {[...Array(full)].map((_, i) => (
          <span key={`f${i}`} className="text-yellow-400 text-lg" style={starStyle}>★</span>
        ))}
        {[...Array(empty)].map((_, i) => (
          <span key={`e${i}`} className="text-gray-300 text-lg" style={starStyle}>★</span>
        ))}
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="w-[90%] max-w-[600px] mx-auto my-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <p>
          Please{' '}
          <a href="/sign-in" className="text-[#bada55] underline">
            sign in
          </a>{' '}
          to view your reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">My Reviews</h2>

      {loading ? (
        <p className="text-gray-500">Loading your reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">You haven’t written any reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[980px]:grid-cols-3 gap-4 mb-8">
          {reviews.map((review) => {
            const likes = review.likedBy?.length || 0;
            const dislikes = review.dislikedBy?.length || 0;
            const score = likes - dislikes;

            return (
              <div
                key={review.id}
                className="relative bg-white border border-gray-200 p-4 rounded shadow-sm flex flex-col justify-between"
              >
                {/* Delete button */}
                <button
                  onClick={() => openDeleteModal(review)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-transform hover:scale-110"
                  title="Delete Review"
                >
                  <Trash2 size={18} />
                </button>


                {/* Restaurant · Dish */}
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  {review.restaurantName} &middot; {review.dishName}
                </div>

                {/* Stars */}
                <div className="mb-2 flex items-center gap-2">
                  {renderStars(Number(review.rating))}
                  <span className="text-sm text-gray-600">{review.rating}</span>
                </div>
                {/* Title & Comment */}
                <h4 className="font-bold mb-1">{review.title}</h4>
                <p className="text-sm mb-2">{review.comment}</p>

                {/* Created Date */}
                {review.createdAt?.toDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.createdAt.toDate()).toLocaleString()}
                  </p>
                )}

                {/* Like/Dislike Score */}
                <div className="mt-3 flex justify-end items-center gap-2 text-sm text-gray-500">
                  <ThumbsUp size={16} className="text-gray-500" />
                  <span>{score}</span>
                  <ThumbsDown size={16} className="text-gray-500" />
                </div>
              </div>
            );
          })}
        </div>
      )}


{showDeleteModal && (
  <div
    onClick={() => setShowDeleteModal(false)} // click outside to close
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-[30px]"
  >
    <div
      onClick={(e) => e.stopPropagation()} // prevent modal click from closing
      className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative"
    >
      {/* Close button (top right) */}
      <button
        onClick={() => setShowDeleteModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* Icon + Message */}
      <div className="text-center">
        <svg
          className="mx-auto mb-4 w-12 h-12 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Delete Review?
        </h3>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>

  );
}
