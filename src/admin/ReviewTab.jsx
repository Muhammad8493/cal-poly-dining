// src/admin/ReviewTab.jsx
import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export default function ReviewTab() {
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedDish, setSelectedDish] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reportedRecords, setReportedRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReported, setShowReported] = useState(false);

  // Load all restaurants once
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'DiningSpots'));
      setRestaurants(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  // Load dishes when restaurant changes (only in normal mode)
  useEffect(() => {
    if (!showReported && selectedRestaurant) {
      (async () => {
        const snap = await getDocs(
          collection(db, 'DiningSpots', selectedRestaurant, 'MenuItems')
        );
        setDishes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      })();
    }
  }, [selectedRestaurant, showReported]);

  // Fetch reviews under a dish or all dishes
  const fetchReviews = async (restId, dishId) => {
    setIsLoading(true);
    let all = [];
    try {
      if (dishId) {
        const snap = await getDocs(
          collection(db, 'DiningSpots', restId, 'MenuItems', dishId, 'Reviews')
        );
        all = snap.docs.map(d => ({ id: d.id, ...d.data(), dishId }));
      } else {
        const menuSnap = await getDocs(
          collection(db, 'DiningSpots', restId, 'MenuItems')
        );
        for (const m of menuSnap.docs) {
          const revSnap = await getDocs(
            collection(db, 'DiningSpots', restId, 'MenuItems', m.id, 'Reviews')
          );
          all = all.concat(
            revSnap.docs.map(d => ({ id: d.id, ...d.data(), dishId: m.id }))
          );
        }
      }
      setReviews(all);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only unresolved report documents
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'Reports'));
      const unresolved = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => !r.resolved);
      setReportedRecords(unresolved);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between normal reviews & reported view
  const handleToggleReported = () => {
    const next = !showReported;
    setShowReported(next);
    setSelectedRestaurant('');
    setSelectedDish('');
    setReviews([]);
    if (next) fetchReports();
  };

  // If filters change while in reported view, switch back to normal
  const handleRestaurantChange = e => {
    if (showReported) setShowReported(false);
    setSelectedRestaurant(e.target.value);
    setSelectedDish('');
    setReviews([]);
  };
  const handleDishChange = e => {
    if (showReported) setShowReported(false);
    setSelectedDish(e.target.value);
  };

  // Flag/unflag a review
  const toggleFlag = async (reviewId, currentFlag, dishId) => {
    if (!selectedRestaurant) {
      return alert('Please select a restaurant first.');
    }
    const ref = doc(
      db,
      'DiningSpots',
      selectedRestaurant,
      'MenuItems',
      dishId,
      'Reviews',
      reviewId
    );
    const newFlag = !Boolean(currentFlag);
    await updateDoc(ref, { flagged: newFlag });
    setReviews(rs =>
      rs.map(r => (r.id === reviewId ? { ...r, flagged: newFlag } : r))
    );
  };

  // Delete a review
  const handleDeleteReview = async (reviewId, dishId) => {
    if (!selectedRestaurant || !dishId) {
      return alert('Please select a restaurant and a dish.');
    }
    if (!window.confirm('Delete this review?')) return;
    const ref = doc(
      db,
      'DiningSpots',
      selectedRestaurant,
      'MenuItems',
      dishId,
      'Reviews',
      reviewId
    );
    await deleteDoc(ref);
    setReviews(rs => rs.filter(r => r.id !== reviewId));
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>

      {/* Toggle between normal & reported */}
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={showReported}
          onChange={handleToggleReported}
        />
        <span className="font-semibold">Reported</span>
      </label>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedRestaurant}
          onChange={handleRestaurantChange}
          disabled={showReported}
          className={`border p-2 rounded ${
            showReported ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        >
          <option value="">Select Restaurant</option>
          {restaurants.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDish}
          onChange={handleDishChange}
          disabled={showReported || !selectedRestaurant}
          className={`border p-2 rounded ${
            showReported || !selectedRestaurant
              ? 'bg-gray-100 cursor-not-allowed'
              : ''
          }`}
        >
          <option value="">All Dishes</option>
          {dishes.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            showReported
              ? fetchReports()
              : fetchReviews(selectedRestaurant, selectedDish)
          }
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {showReported ? 'Reload Reports' : 'Load Reviews'}
        </button>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-500">Loading…</div>
        ) : showReported ? (
          reportedRecords.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No unresolved reports.
            </div>
          ) : (
            reportedRecords.map(r => (
              <div
                key={r.id}
                className="border p-4 rounded flex flex-col gap-2"
              >
                <div className="text-sm">Restaurant: {r.restaurantName}</div>
                <div className="text-sm">Dish: {r.dishName}</div>
                <div className="font-bold text-red-600">Review: {r.reviewTitle}</div>
                <div className="italic text-sm text-red-600">{r.reviewComment}</div>
                <div className="text-sm text-red-600">
                  <strong>By:</strong> {r.reportedUserEmail}
                </div>
                <div className="text-sm text-blue-800">
                  <strong>Reporter:</strong> {r.reporterEmail}
                </div>
                <div className="text-sm text-blue-800">
                  <strong>Reason:</strong> {r.reason}
                </div>
                <div className="text-xs text-gray-500">
                  Reported at: {r.createdAt?.toDate().toLocaleString() || '—'}
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                {/* Flag the original review */}
                <button
                  onClick={async () => {
                    try {
                      const ref = doc(
                        db,
                        'DiningSpots',
                        r.restaurantId,
                        'MenuItems',
                        r.dishId,
                        'Reviews',
                        r.reviewId
                      );
                      await updateDoc(ref, { flagged: true });
                      alert('Review flagged.');
                    } catch (err) {
                      console.error('Error flagging review:', err);
                      alert('Failed to flag review.');
                    }
                  }}
                  className="rounded px-2 text-xl text-gray-400 hover:scale-104"
                >
                  ⚑
                </button>

                {/* Delete the original review */}
                <button
                  onClick={async () => {
                    if (!window.confirm('Are you sure you want to delete this review?')) return;
                    try {
                      const ref = doc(
                        db,
                        'DiningSpots',
                        r.restaurantId,
                        'MenuItems',
                        r.dishId,
                        'Reviews',
                        r.reviewId
                      );
                      await deleteDoc(ref);
                      alert('Review deleted.');
                    } catch (err) {
                      console.error('Error deleting review:', err);
                      alert('Failed to delete review.');
                    }
                  }}
                  className="rounded text-lg pr-15 hover:scale-103"
                >
                  🗑️
                </button>

                {/* ban the reviewer */}
                <button
                  onClick={async () => {
                    try {
                      // First find the user by email
                      const usersSnap = await getDocs(
                        collection(db, 'Users')
                      );
                      const userDoc = usersSnap.docs.find(u => u.data().email === r.reportedUserEmail);

                      if (!userDoc) {
                        alert('Could not find user by email.');
                        return;
                      }

                      const userRef = doc(db, 'Users', userDoc.id);
                      await updateDoc(userRef, { status: 'banned' });

                      alert(`User ${r.reportedUserEmail} has been banned.`);
                    } catch (err) {
                      console.error('Error banning user:', err);
                      alert('Failed to ban user.');
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 rounded text-sm"
                >
                  Ban
                </button>

                {/* Mark report as resolved */}
                <button
                  onClick={async () => {
                    try {
                      const reportRef = doc(db, 'Reports', r.id);
                      await updateDoc(reportRef, { resolved: true });
                      setReportedRecords(prev => prev.filter(rr => rr.id !== r.id));
                      alert('Report marked as resolved.');
                    } catch (err) {
                      console.error('Error resolving report:', err);
                      alert('Failed to resolve report.');
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                >
                  Resolve
                </button>
              </div>
              </div>
            ))
          )
        ) : reviews.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No reviews found.
          </div>
        ) : (
          reviews.map(review => (
            <div
              key={review.id}
              className="border p-4 rounded relative flex flex-col justify-between min-h-[200px]"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">
                  {review.title}
                </span>
                <button
                  onClick={() =>
                    toggleFlag(review.id, review.flagged, review.dishId)
                  }
                  className={`text-xl cursor-pointer hover:scale-103 ${
                    review.flagged ? 'text-red-500' : 'text-gray-400'
                  }`}
                  title="Toggle flag"
                >
                  ⚑
                </button>
              </div>
              <p className="text-sm mb-2">{review.comment}</p>
              <div className="mt-2 text-sm text-gray-600">
                By {review.name} ({review.email})
              </div>
              <button
                onClick={() => handleDeleteReview(review.id, review.dishId)}
                className="absolute bottom-2 right-2 text-lg text-red-500 hover:scale-102"
                title="Delete review"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
