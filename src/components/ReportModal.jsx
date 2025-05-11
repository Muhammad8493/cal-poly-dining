// src/components/ReportModal.jsx
import React, { useState } from 'react';

export default function ReportModal({
  review,
  onClose,
  onSubmit,
  reporterName,
  reporterEmail
}) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOverlayClick = () => {
    if (!isSubmitting) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please enter a reason (max 100 chars).');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(reason.trim());
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2.5"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Report Review</h2>
        <p className="mb-2">
          Reporting <strong>{review.name}</strong>'s review: <em>“{review.title}”</em>
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={4}
            maxLength={100}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason (up to 100 characters)"
            className="w-full border p-2 rounded mb-2"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {isSubmitting ? 'Reporting…' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
