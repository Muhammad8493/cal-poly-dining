// src/pages/Contact.jsx
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
  });

  // Handle input changes with character limits for subject and message
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'subject' && value.length > 50) return;
    if (name === 'message' && value.length > 500) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Send form data to the Firestore "Reports" collection
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Reports'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert('Message sent! Data saved to Reports.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-white p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>

        {/* First and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-black font-semibold" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 rounded text-black outline-1"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block mb-1 text-black font-semibold" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 rounded text-black outline-1"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 text-black font-semibold" htmlFor="email">
              Your email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded text-black outline-1"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-black font-semibold" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 rounded text-black outline-1"
              placeholder="+1 (234) 567-8901"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="mt-4">
          <label className="block mb-1 text-black font-semibold" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 rounded text-black outline-1"
            placeholder="Subject (max 50 chars)"
          />
          <div className="text-sm text-gray-400 text-right">
            {formData.subject.length}/50
          </div>
        </div>

        {/* Message */}
        <div className="mt-4">
          <label className="block mb-1 text-black font-semibold" htmlFor="message">
            Your message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 rounded text-black outline-1"
            placeholder="Leave a comment..."
          />
          <div className="text-sm text-gray-400 text-right">
            {formData.message.length}/500
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
