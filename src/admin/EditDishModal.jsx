// src/admin/EditDishModal.jsx
import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function EditDishModal({ dish, restaurantId, onClose, onUpdate, onDelete }) {
  const [editedDish, setEditedDish] = useState({ ...dish });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dishRef = doc(db, 'DiningSpots', restaurantId, 'MenuItems', dish.id);
      await updateDoc(dishRef, editedDish);
      onUpdate(editedDish);
      onClose();
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this dish?')) {
      try {
        await deleteDoc(doc(db, 'DiningSpots', restaurantId, 'MenuItems', dish.id));
        onDelete(dish.id);
        onClose();
      } catch (error) {
        console.error('Error deleting dish:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Dish</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={editedDish.name}
            onChange={(e) => setEditedDish({ ...editedDish, name: e.target.value })}
            placeholder="Dish Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={editedDish.category}
            onChange={(e) => setEditedDish({ ...editedDish, category: e.target.value })}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <textarea
            value={editedDish.description}
            onChange={(e) => setEditedDish({ ...editedDish, description: e.target.value })}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={editedDish.image}
            onChange={(e) => setEditedDish({ ...editedDish, image: e.target.value })}
            placeholder="Image URL"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={editedDish.price}
            onChange={(e) => setEditedDish({ ...editedDish, price: e.target.value })}
            placeholder="Price"
            className="border p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editedDish.availability}
              onChange={(e) => setEditedDish({ ...editedDish, availability: e.target.checked })}
            />
            <span>Available</span>
          </label>
          <input
            type="date"
            value={editedDish.dateIntroduced}
            onChange={(e) => setEditedDish({ ...editedDish, dateIntroduced: e.target.value })}
            className="border p-2 rounded"
          />
          <div className="flex justify-end gap-2 mt-4">
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
