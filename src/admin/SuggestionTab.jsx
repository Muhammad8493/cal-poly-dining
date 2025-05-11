// src/admin/SuggestionTab.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function SuggestionTab() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const snap = await getDocs(collection(db, 'Suggestions'));
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSuggestions(items);
      } catch (err) {
        console.error('Error loading suggestions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSuggestions();
  }, []);

  async function handleResolve(id) {
    try {
      await deleteDoc(doc(db, 'Suggestions', id));
      setSuggestions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete suggestion.');
    }
  }

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Suggestions</h2>
      {loading ? (
        <p className="text-gray-500">Loading suggestions...</p>
      ) : suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {suggestions.map(s => (
            <div key={s.id} className="border p-4 rounded bg-white flex flex-col justify-between shadow-sm">
              <h4 className="font-semibold text-lg mb-1 text-gray-800">{s.subject || '(No Subject)'}</h4>
              <p className="text-sm text-gray-700 mb-2">{s.message}</p>
              <div className="text-xs text-gray-500 mb-2">
                <div>{s.firstName} {s.lastName}</div>
                <div>{s.email}</div>
                <div>{s.phoneNumber}</div>
              </div>
              <button
                onClick={() => handleResolve(s.id)}
                className="self-end text-white bg-green-600 hover:bg-green-500 py-1 px-3 rounded text-sm"
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
