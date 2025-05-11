// src/pages/Dish.jsx
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';
import { db } from '../firebase';
import '../components/StarRating.css';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

export default function Dish({ isLoggedIn, userName, userEmail, addReview }) {
  const { name: restaurantId, dishName: dishId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [dishDetails, setDishDetails] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reportingReview, setReportingReview] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Restaurant
      const restSnap = await getDoc(doc(db, 'DiningSpots', restaurantId));
      if (restSnap.exists()) setRestaurantInfo({ id: restSnap.id, ...restSnap.data() });

      // Dish
      const dishSnap = await getDoc(doc(db, 'DiningSpots', restaurantId, 'MenuItems', dishId));
      if (dishSnap.exists()) setDishDetails({ id: dishSnap.id, ...dishSnap.data() });

      // Reviews
      const revSnap = await getDocs(
        collection(db, 'DiningSpots', restaurantId, 'MenuItems', dishId, 'Reviews')
      );
      setReviews(
        revSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          likedBy: d.data().likedBy || [],
          dislikedBy: d.data().dislikedBy || [],
        }))
      );
    }
    fetchData();
  }, [restaurantId, dishId]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

  const handleBackClick = () => navigate(-1);

  const handleWriteReviewClick = () => {
    if (!isLoggedIn) return navigate('/sign-in', { state: { from: location } });
    if (reviews.some(r => r.email === userEmail)) {
      return alert('You have already written a review for this dish.');
    }
    setIsReviewModalOpen(true);
  };

  const handleReportClick = review => {
    if (!isLoggedIn) return navigate('/sign-in', { state: { from: location } });
    setReportingReview(review);
  };

  const handleReportSubmit = async reason => {
    try {
      await addDoc(collection(db, 'Reports'), {
        reviewId:          reportingReview.id,
        restaurantId,
        restaurantName:    restaurantInfo?.name || '',
        dishId,
        dishName:          dishDetails?.name || '',
        reportedUserEmail: reportingReview.email,
        reviewTitle:       reportingReview.title,
        reviewComment:     reportingReview.comment,
        reporterName:      userName,
        reporterEmail:     userEmail,
        reason,
        createdAt:         serverTimestamp(),
        resolved:          false
      });
      alert('Report submitted. Thank you.');
    } catch (err) {
      console.error(err);
      alert('Failed to submit report.');
    } finally {
      setReportingReview(null);
    }
  };


  function StarBar({ value = 0 }) {
    const pct = Math.max(0, Math.min(5, value)) * 20;
  
    return (
      <div className="rating">
        <div className="rating-upper" style={{ width: `${pct}%` }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
        <div className="rating-lower">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>
    );
  }
  
  


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
  

  // Like / Dislike handlers
  const handleLike = async review => {
    if (!isLoggedIn) return;
    const ref = doc(db, 'DiningSpots', restaurantId, 'MenuItems', dishId, 'Reviews', review.id);
    const hasLiked = review.likedBy?.includes(userEmail);
    const hasDisliked = review.dislikedBy?.includes(userEmail);

    // toggle like
    const updates = {};
    if (hasLiked) {
      updates.likedBy = arrayRemove(userEmail);
    } else {
      updates.likedBy = arrayUnion(userEmail);
      if (hasDisliked) updates.dislikedBy = arrayRemove(userEmail);
    }
    await updateDoc(ref, updates);

    // update local
    setReviews(rs => rs.map(r => {
      if (r.id !== review.id) return r;
      const likedBy = hasLiked
        ? r.likedBy.filter(e => e!==userEmail)
        : [...r.likedBy, userEmail];
      const dislikedBy = hasDisliked && !hasLiked
        ? r.dislikedBy.filter(e => e!==userEmail)
        : r.dislikedBy;
      return { ...r, likedBy, dislikedBy };
    }));
  };

  const handleDislike = async review => {
    if (!isLoggedIn) return;
    const ref = doc(db, 'DiningSpots', restaurantId, 'MenuItems', dishId, 'Reviews', review.id);
    const hasLiked = review.likedBy?.includes(userEmail);
    const hasDisliked = review.dislikedBy.includes(userEmail);

    const updates = {};
    if (hasDisliked) {
      updates.dislikedBy = arrayRemove(userEmail);
    } else {
      updates.dislikedBy = arrayUnion(userEmail);
      if (hasLiked) updates.likedBy = arrayRemove(userEmail);
    }
    await updateDoc(ref, updates);

    setReviews(rs => rs.map(r => {
      if (r.id !== review.id) return r;
      const dislikedBy = hasDisliked
        ? r.dislikedBy.filter(e => e!==userEmail)
        : [...r.dislikedBy, userEmail];
      const likedBy = hasLiked && !hasDisliked
        ? r.likedBy.filter(e => e!==userEmail)
        : r.likedBy;
      return { ...r, likedBy, dislikedBy };
    }));
  };

  // Watch for auto-flag condition
  useEffect(() => {
    reviews.forEach(async r => {
      const score = (r.likedBy.length - r.dislikedBy.length);
      if (score <= -5 && !r.flagged) {
        const ref = doc(db, 'DiningSpots', restaurantId, 'MenuItems', dishId, 'Reviews', r.id);
        await updateDoc(ref, { flagged: true });
        // auto report
        await addDoc(collection(db,'Reports'),{
          reviewId: r.id,
          restaurantId,
          restaurantName: restaurantInfo?.name,
          dishId,
          dishName: dishDetails?.name,
          reportedUserEmail: r.email,
          reviewTitle: r.title,
          reviewComment: r.comment,
          reporterName: 'AutoModerator',
          reporterEmail: 'auto@moderator',
          reason: 'Community downvotes threshold reached',
          createdAt: serverTimestamp(),
          resolved: false
        });
      }
    });
  }, [reviews, restaurantId, dishId, restaurantInfo, dishDetails]);

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-3">
      {/* Back + Restaurant image */}
      <div className="flex items-center mb-1 max-[6000px]:mb-0">
        <button onClick={handleBackClick}
          className="bg-[#bada55] text-[#333333] px-3 py-1.5 rounded font-bold hover:bg-[#ffffff] hover:text-[#333333] transition-colors text-sm max-[600px]:text-xs">
          &larr; Back
        </button>
        {restaurantInfo?.image && (
          <img src={restaurantInfo.image}
               alt={restaurantInfo.name}
               className="w-12 h-12 rounded ml-4 object-cover max-[600px]:w-11 max-[600px]:h-11"
               />
        )}
      </div>

      {/* Dish header */}
      <div className="flex flex-col min-[600px]:flex-row gap-6 mb-8">
        {dishDetails && (
          <img src={dishDetails.image || 'https://place-hold.it/300'}
               alt={dishDetails.name}
               className="w-full  md:w-1/3 max-h-70 min-[400px]:max-h-75 min-[500px]:max-h-85 min-[600px]:max-w-80  min-[700px]:max-w-90 min-[1300px]:max-h-90 object-cover"/>
        )}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-2">{dishDetails?.name || 'Loading...'}</h2>
          <p className="mb-2">{dishDetails?.description}</p>
          <div className="flex items-center gap-2 mb-2">
            <StarBar value={averageRating} />
            <span className="text-sm text-gray-600">
              {averageRating ? averageRating.toFixed(1) : 'No ratings yet'}
            </span>
          </div>
          <p className="mb-2">Reviews: {reviews.length}</p>
          <button onClick={handleWriteReviewClick}
                  className="bg-[#bada55] text-[#333333] px-3 py-1 rounded font-bold hover:bg-[#ffffff] hover:text-[#333333] transition-colors mt-4">
            {isLoggedIn ? 'Write a Review' : 'Sign in to review'}
          </button>
        </div>
      </div>

      {/* Reviews grid */}
      <h3 className="text-xl font-bold mb-4">Latest reviews</h3>
      <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[980px]:grid-cols-3 gap-4 mb-8">
        {reviews.filter(r => !r.flagged).map(review => {
            const likes = review.likedBy?.length || 0;
            const dislikes = review.dislikedBy?.length || 0;
            const score = likes - dislikes;
          return (
            <div key={review.id}
                 className="relative bg-white border border-gray-200 p-4 rounded shadow-sm flex flex-col justify-between">
              {/* Report button */}
              <button onClick={() => handleReportClick(review)}
                      className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gray-600"
                      title="Report this review">
                ⋮
              </button>
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
                  {review.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="text-gray-600 text-sm">{review.name}</div>
              </div>
                {/* Like/Dislike*/}
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <button
                    onClick={() => handleLike(review)}
                    disabled={!isLoggedIn}
                    className={`transition-transform hover:scale-110 ${
                      review.likedBy?.includes(userEmail) ? 'text-blue-500' : 'text-gray-400'
                    }`}
                    title="Like"
                  >
                    <ThumbsUp size={20} />
                  </button>
                  <span className="text-sm font-semibold">{score}</span>
                  <button
                    onClick={() => handleDislike(review)}
                    disabled={!isLoggedIn}
                    className={`transition-transform hover:scale-110 ${
                      review.dislikedBy.includes(userEmail) ? 'text-red-500' : 'text-gray-400'
                    }`}
                    title="Dislike"
                  >
                    <ThumbsDown size={20} />
                  </button>
                </div>
            </div>
          );
        })}
      </div>

      {/* Review modal */}
      {isReviewModalOpen && (
        <ReviewModal
          onClose={() => setIsReviewModalOpen(false)}
          addReview={addReview}
          onReviewAdded={nr => setReviews(r => [nr, ...r])}
          restaurantName={restaurantId}
          dishName={dishId}
          userName={userName}
          userEmail={userEmail}
          renderStars={renderStars}
        />
      )}

      {/* Report modal */}
      {reportingReview && (
        <ReportModal
          review={reportingReview}
          onClose={() => setReportingReview(null)}
          onSubmit={handleReportSubmit}
          reporterName={userName}
          reporterEmail={userEmail}
        />
      )}
    </div>
  );
}
