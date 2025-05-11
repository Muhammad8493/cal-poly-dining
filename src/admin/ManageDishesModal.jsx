// src/admin/ManageDishesModal.jsx
import React, { useState } from 'react';
import EditDishModal from './EditDishModal';

export default function ManageDishesModal({ restaurantId, dishes, onClose, onRefresh }) {
  const [selectedDish, setSelectedDish] = useState(null);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Manage Dishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dishes && dishes.length > 0 ? (
            dishes.map(dish => (
              <div key={dish.id} className="border p-4 rounded flex justify-between items-center">
                <div className="flex items-center">
                  {dish.image && (
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-9 h-11 rounded mr-2 object-cover" 
                    />
                  )}
                  <span>{dish.name}</span>
                </div>
                <button
                  onClick={() => setSelectedDish(dish)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </div>
            ))
          ) : (
            <p>No dishes available.</p>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button 
            onClick={onClose} 
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
        {selectedDish && (
          <EditDishModal
            dish={selectedDish}
            restaurantId={restaurantId}
            onClose={() => setSelectedDish(null)}
            onUpdate={() => onRefresh()}
            onDelete={() => onRefresh()}
          />
        )}
      </div>
    </div>
  );
}
