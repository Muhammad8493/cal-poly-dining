// src/admin/PollEditModal.jsx
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function PollEditModal({ poll, onClose, onUpdate, onDelete }) {
  const [editedPoll, setEditedPoll] = useState({
    question: '',
    timeLeft: '',
    isLive: false,
    options: ''
  });

  useEffect(() => {
    if (poll) {
      setEditedPoll({
        question: poll.question || '',
        timeLeft: poll.timeLeft || '',
        isLive: poll.isLive || false,
        options: poll.options ? poll.options.map(opt => opt.text).join('\n') : ''
      });
    }
  }, [poll]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const edited = {
      id: poll.id, 
      question: editedPoll.question,
      timeLeft: editedPoll.timeLeft,
      isLive: editedPoll.isLive,
      options: editedPoll.options, 
    };
    onUpdate(edited);          
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await deleteDoc(doc(db, 'Polls', poll.id));
        onDelete(poll.id);
        onClose();
      } catch (error) {
        console.error('Error deleting poll:', error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Poll</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={editedPoll.question}
            onChange={(e) => setEditedPoll({ ...editedPoll, question: e.target.value })}
            placeholder="Poll Question"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={editedPoll.timeLeft}
            onChange={(e) => setEditedPoll({ ...editedPoll, timeLeft: e.target.value })}
            placeholder="Time Left"
            className="border p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editedPoll.isLive}
              onChange={(e) => setEditedPoll({ ...editedPoll, isLive: e.target.checked })}
            />
            <span>Poll is Live</span>
          </label>
          <textarea
            value={editedPoll.options}
            onChange={(e) => setEditedPoll({ ...editedPoll, options: e.target.value })}
            placeholder="Enter options, one per line"
            className="border p-2 rounded"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
