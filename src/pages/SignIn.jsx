// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';


export default function SignIn({ setIsLoggedIn, setUserName }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isFormValid = username.trim() !== '' && password.trim() !== '';

  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    // Simulate a 1-second loading delay
    setTimeout(() => {
      // Save the actual username entered by the user
      setUserName(username);
      setIsLoggedIn(true);
      setIsLoading(false);
      navigate('/');
    }, 1000);
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full border border-gray-300 px-3 py-2 rounded 
                       focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 px-3 py-2 rounded 
                       focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-2 rounded font-bold transition-colors ${
            isFormValid && !isLoading
              ? 'bg-[#bada55] text-[#333333] hover:bg-[#ffffff] hover:text-[#333333]'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
