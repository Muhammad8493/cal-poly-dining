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

  // Send form data to the Firestore "Suggestions" collection
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Suggestions'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert('Thank you for sharing.');
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-5">Contact Us</h2>

        {/* First and Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block mb-1 font-semibold">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="First Name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-1 font-semibold">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Your Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block mb-1 font-semibold">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="+1 (234) 567-8901"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="mt-4">
          <label htmlFor="subject" className="block mb-1 font-semibold">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Subject (max 50 chars)"
          />
          <div className="text-sm text-gray-500 text-right">
            {formData.subject.length}/50
          </div>
        </div>

        {/* Message */}
        <div className="mt-4">
          <label htmlFor="message" className="block mb-1 font-semibold">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Leave a comment... (max 500 chars)"
          />
          <div className="text-sm text-gray-500 text-right">
            {formData.message.length}/500
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
