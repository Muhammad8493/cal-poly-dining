// src/pages/Restaurant.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function Restaurant() {
  const { name } = useParams(); // e.g. "Brunch"
  const navigate = useNavigate();

  // Example dish data
  const mockDishes = [
    { id: 1, dishName: 'Burger',  description: 'A short description', rating: 'Rating: 1.8', reviews: '12 Reviews', img: 'https://place-hold.it/300' },
    { id: 2, dishName: 'Salad',  description: 'A short description', rating: 'Rating: 4.5', reviews: '12 Reviews', img: 'https://place-hold.it/300' },
    { id: 3, dishName: 'Pizza',  description: 'A short description', rating: 'Rating: 5.0', reviews: '12 Reviews', img: 'https://place-hold.it/300' },
    { id: 4, dishName: 'Sandwich',  description: 'A short description', rating: 'Rating: 4.2', reviews: '12 Reviews', img: 'https://place-hold.it/300' },
    { id: 5, dishName: 'Soup',  description: 'A short description', rating: 'Rating: 4.1', reviews: '12 Reviews', img: 'https://place-hold.it/300' },
    { id: 6, dishName: 'Pasta',  description: 'A short description', rating: 'Rating: 3.5', reviews: '12 Reviews', img: 'https://place-hold.it/300' },
  ];

  function handleBackClick() {
    navigate(-1); // go back to the previous page (Home)
  }

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-5">
    {/* Wrap button and heading in a flex column container */}
    <div className="flex flex-col">
      {/* Back button */}
      <button
        onClick={handleBackClick}
        className="bg-[#bada55] text-[#333333] px-3 py-1 rounded font-bold 
                   hover:bg-[#ffffff] hover:text-[#333333] transition-colors mb-2 self-start"
      >
        &larr; Back
      </button>
  
      {/* Restaurant Name */}
      <h2 className="text-2xl font-bold border-b-2 border-[#bada55] inline-block pb-1 mb-6">
        {name}
      </h2>
    </div>

      {/* 3) 3-column dish layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockDishes.map(dish => (
          <Link
            key={dish.id}
            to={`/restaurant/${name}/dish/${dish.dishName}`}
          >
            <div className="bg-[#f9f9f9] border border-[#eeeeee] p-4 rounded
                           hover:shadow-md transition-shadow text-center cursor-pointer">
              <img
                src={dish.img}
                alt={dish.dishName}
                className="w-52 mb-2"
              />
              <div className="font-bold text-[#333333]  text-left">{dish.dishName}</div>
              <p className="text-sm text-gray-600 text-left">{dish.description}</p>
              <p className="text-sm text-gray-600  text-left">{dish.rating}</p>
              <p className="text-sm text-gray-600  text-left">{dish.reviews}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
