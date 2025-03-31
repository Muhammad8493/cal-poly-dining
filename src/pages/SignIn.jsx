// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function SignIn({ setIsLoggedIn, setUserName, setUserEmail }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  // Sign in with email and password
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserName(user.displayName || user.email);
      setUserEmail(user.email);
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  // Create a new account using email and password
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Optionally, update the user profile here with a display name
      setUserName(user.displayName || user.email);
      setUserEmail(user.email);
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  // Sign in using Google popup
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUserName(user.displayName || user.email);
      setUserEmail(user.email);
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-100">
      <form
        onSubmit={handleEmailSignIn}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
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
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={handleSignUp}
            disabled={!isFormValid || isLoading}
            className="w-[48%] py-2 rounded font-bold transition-colors bg-green-500 text-white hover:bg-green-400"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-[48%] py-2 rounded font-bold transition-colors bg-blue-500 text-white hover:bg-blue-400"
          >
            {isLoading ? 'Loading...' : 'Sign in with Google'}
          </button>
        </div>
      </form>
    </div>
  );
}
