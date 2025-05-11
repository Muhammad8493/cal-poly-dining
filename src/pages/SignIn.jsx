// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignIn({ setIsLoggedIn, setUserName, setUserEmail }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  async function ensureUserRecord(user) {
    const userRef = doc(db, 'Users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email,
        role: 'user',
        status: 'active',
        createdAt: serverTimestamp()
      });
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await ensureUserRecord(user);

      const userRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && userDoc.data().status === 'banned') {
        throw new Error('Your account has been banned.');
      }

      setUserName(user.displayName || user.email);
      setUserEmail(user.email);
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-100 px-5">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
      <h2 className="text-xl font-bold mb-2 min-[354px]:text-2xl">Cal Poly Dining Reviews</h2>
        <h2 className="text-xl pt-4 mb-2">Sign In</h2>
        <p className="text-sm pb-8 text-gray-600 mb-6">Share Your Dining Experience</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2 flex items-center justify-center gap-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/640px-Google_%22G%22_logo.svg.png" alt="Google" className="w-5 h-5" />
          {isLoading ? 'Please wait…' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}
