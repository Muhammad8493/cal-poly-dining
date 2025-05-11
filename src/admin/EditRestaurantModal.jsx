// src/admin/EditRestaurantModal.jsx
import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function EditRestaurantModal({ restaurant, onClose, onUpdate, onDelete }) {
  const [editedRestaurant, setEditedRestaurant] = useState({ ...restaurant });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const restaurantRef = doc(db, 'DiningSpots', restaurant.id);
      await updateDoc(restaurantRef, {
        name: editedRestaurant.name,
        location: editedRestaurant.location,
        image: editedRestaurant.image
      });
      onUpdate(editedRestaurant);
      onClose();
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this restaurant?')) {
      try {
        await deleteDoc(doc(db, 'DiningSpots', restaurant.id));
        onDelete(restaurant.id);
        onClose();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Restaurant</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={editedRestaurant.name}
            onChange={(e) => setEditedRestaurant({ ...editedRestaurant, name: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <select
            value={editedRestaurant.location}
            onChange={(e) => setEditedRestaurant({ ...editedRestaurant, location: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="Vista Grande">Vista Grande</option>
            <option value="1901 Marketplace">1901 Marketplace</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={editedRestaurant.image}
            onChange={(e) => setEditedRestaurant({ ...editedRestaurant, image: e.target.value })}
            className="border p-2 rounded"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded">
              Delete
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-3 py-1 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
