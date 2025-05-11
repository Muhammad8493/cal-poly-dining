// src/admin/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

// Import modal components
import EditRestaurantModal from './EditRestaurantModal';
import ManageDishesModal from './ManageDishesModal';
import PollEditModal from './PollEditModal';
import ReviewTab from './ReviewTab';
import UsersTab from './UsersTab';
import SuggestionTab from './SuggestionTab';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('restaurants');

  /*** RESTAURANT STATE ***/
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    location: 'Vista Grande',
    image: ''
  });
  const [restaurants, setRestaurants] = useState([]);
  // When editing a restaurant:
  const [restaurantToEdit, setRestaurantToEdit] = useState(null);

  // For Create New Dish section:
  const [selectedRestaurantForDishes, setSelectedRestaurantForDishes] = useState('');
  const [newDish, setNewDish] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    price: '',
    availability: true,
    dateIntroduced: ''
  });
  // For the Manage Dishes modal, store dishes for the selected restaurant.
  const [dishesForRestaurant, setDishesForRestaurant] = useState([]);
  // Missing state: control when the Manage Dishes modal is visible.
  const [showManageDishesModal, setShowManageDishesModal] = useState(false);

  /*** POLL STATE ***/
  const [newPoll, setNewPoll] = useState({
    question: '',
    timeLeft: '',
    isLive: true,
    options: ''
  });
  const [polls, setPolls] = useState([]);
  // Control Poll edit modal:
  const [pollEditModal, setPollEditModal] = useState({ isOpen: false, poll: null });

  /*** REVIEWS STATE ***/
  // The ReviewTab component will manage its own state

  // --- FETCH FUNCTIONS ---
  const fetchRestaurants = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'DiningSpots'));
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchPolls = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'Polls'));
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const fetchDishes = async (restaurantId) => {
    try {
      const snapshot = await getDocs(collection(db, 'DiningSpots', restaurantId, 'MenuItems'));
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setDishesForRestaurant(data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'restaurants') {
      fetchRestaurants();
    } else if (activeTab === 'polls') {
      fetchPolls();
    }
  }, [activeTab]);

  /*** RESTAURANT FUNCTIONS ***/
  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'DiningSpots'), newRestaurant);
      alert('Restaurant created successfully!');
      setNewRestaurant({ name: '', location: 'Vista Grande', image: '' });
      fetchRestaurants();
    } catch (error) {
      console.error('Error creating restaurant:', error);
      alert('Error creating restaurant.');
    }
  };

  const handleUpdateRestaurant = async (editedRestaurant) => {
    try {
      const restaurantRef = doc(db, 'DiningSpots', editedRestaurant.id);
      await updateDoc(restaurantRef, {
        name: editedRestaurant.name,
        location: editedRestaurant.location,
        image: editedRestaurant.image
      });
      alert('Restaurant updated successfully!');
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Error updating restaurant.');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    // Deletion will only be via modal now.
    try {
      await deleteDoc(doc(db, 'DiningSpots', id));
      alert('Restaurant deleted successfully!');
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Error deleting restaurant.');
    }
  };

  /*** DISH FUNCTIONS ***/
  const handleCreateDish = async (e) => {
    e.preventDefault();
    if (!selectedRestaurantForDishes) {
      alert('Please select a restaurant.');
      return;
    }
    try {
      await addDoc(collection(db, 'DiningSpots', selectedRestaurantForDishes, 'MenuItems'), {
        ...newDish,
        image: newDish.image || '',
        rating: 0
      });
      alert('Dish created successfully!');
      setNewDish({
        name: '',
        category: '',
        description: '',
        image: '',
        price: '',
        availability: true,
        dateIntroduced: ''
      });
      fetchDishes(selectedRestaurantForDishes);
    } catch (error) {
      console.error('Error adding dish:', error);
      alert('Error adding dish.');
    }
  };

  /*** POLL FUNCTIONS ***/
  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const optionsArray = newPoll.options.split('\n').filter(opt => opt.trim() !== '');
    const options = optionsArray.map(text => ({ text, votes: "0" }));
    try {
      await addDoc(collection(db, 'Polls'), {
        question: newPoll.question,
        timeLeft: newPoll.timeLeft,
        isLive: newPoll.isLive,
        options,
        users: {}
      });
      alert('Poll created successfully!');
      setNewPoll({ question: '', timeLeft: '', isLive: true, options: '' });
      fetchPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Error creating poll.');
    }
  };

  const handleDeletePoll = async (pollId) => {
    try {
    await deleteDoc(doc(db, 'Polls', pollId));
    alert('Poll deleted successfully!');
    fetchPolls();
    } catch (error) {
    console.error('Error deleting poll:', error);
    alert('Error deleting poll.');
    }
  };

  const handleUpdatePoll = async (editedPoll) => {
    try {
      const optionsArray = editedPoll.options
        .split('\n')
        .filter(opt => opt.trim() !== '');
      // Rebuild the poll's options array:
      const options = optionsArray.map(opt => ({ text: opt, votes: "0" }));
      
      const pollRef = doc(db, 'Polls', editedPoll.id);
      await updateDoc(pollRef, {
        question: editedPoll.question,
        timeLeft: editedPoll.timeLeft,
        isLive: editedPoll.isLive,
        options
      });
      
      alert('Poll updated successfully!');
      // Close the modal or update local polls state as needed:
      setPollEditModal({ isOpen: false, poll: null });
      // Optionally re-fetch the polls list:
      fetchPolls();
    } catch (error) {
      console.error('Error updating poll:', error);
      alert('Error updating poll.');
    }
  };

  /*** RENDER JSX ***/
  return (
    <div className="w-[90%] max-w-4xl mx-auto my-10">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'restaurants' ? 'bg-[#bada55] text-[#333333]' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'polls' ? 'bg-[#bada55] text-[#333333]' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('polls')}
        >
          Polls
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'reviews' ? 'bg-[#bada55] text-[#333333]' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button
            className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-[#bada55] text-[#333333]' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('users')}
        >
            Users
        </button>
        <button
            className={`px-4 py-2 rounded ${activeTab === 'suggestions' ? 'bg-[#bada55] text-[#333333]' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('suggestions')}
        >
            Suggestions
        </button>
      </div>

      {activeTab === 'restaurants' && (
        <>
          {/* Create New Restaurant Section */}
          <div className="mb-8 p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create New Restaurant</h2>
            <form onSubmit={handleCreateRestaurant} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                required
                className="border p-2 rounded"
              />
              <select
                value={newRestaurant.location}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="Vista Grande">Vista Grande</option>
                <option value="1901 Marketplace">1901 Marketplace</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newRestaurant.image}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, image: e.target.value })}
                className="border p-2 rounded"
              />
              <button type="submit" className="bg-[#bada55] text-[#333333] px-4 py-2 rounded font-bold">
                Create Restaurant
              </button>
            </form>
          </div>

          {/* Create New Dish Section */}
          <div className="mb-8 p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create New Dish</h2>
            <form onSubmit={handleCreateDish} className="flex flex-col gap-4">
              <select
                value={selectedRestaurantForDishes}
                onChange={(e) => setSelectedRestaurantForDishes(e.target.value)}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Restaurant</option>
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Dish Name"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={newDish.category}
                onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={newDish.description}
                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newDish.image}
                onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={newDish.price}
                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                className="border p-2 rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newDish.availability}
                  onChange={(e) => setNewDish({ ...newDish, availability: e.target.checked })}
                />
                <span>Available</span>
              </label>
              <input
                type="date"
                placeholder="Date Introduced"
                value={newDish.dateIntroduced}
                onChange={(e) => setNewDish({ ...newDish, dateIntroduced: e.target.value })}
                className="border p-2 rounded"
              />
              <button type="submit" className="bg-[#bada55] text-[#333333]e px-4 py-2 rounded font-bold">
                Add Dish
              </button>
            </form>
          </div>

          {/* Existing Restaurants List */}
          <div className="mb-8 p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Existing Restaurants</h2>
            {restaurants.map(r => (
              <div key={r.id} className="border p-4 rounded mb-4 flex justify-between items-center">
                <div>
                  <strong>{r.name}</strong> - {r.location}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setRestaurantToEdit(r);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      setSelectedRestaurantForDishes(r.id);
                      await fetchDishes(r.id);
                      setShowManageDishesModal(true);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Manage Dishes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

        {activeTab === 'polls' && (
        <>
            {/* Create New Poll */}
            <div className="mb-8 p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create New Poll</h2>
            <form onSubmit={handleCreatePoll} className="flex flex-col gap-4">
                <input
                type="text"
                placeholder="Poll Question"
                value={newPoll.question}
                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                required
                className="border p-2 rounded"
                />
                <input
                type="text"
                placeholder="Time Left (e.g., '3 days left')"
                value={newPoll.timeLeft}
                onChange={(e) => setNewPoll({ ...newPoll, timeLeft: e.target.value })}
                required
                className="border p-2 rounded"
                />
                <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={newPoll.isLive}
                    onChange={(e) => setNewPoll({ ...newPoll, isLive: e.target.checked })}
                />
                <span>Poll is Live</span>
                </label>
                <textarea
                placeholder="Enter options, one per line"
                value={newPoll.options}
                onChange={(e) => setNewPoll({ ...newPoll, options: e.target.value })}
                required
                className="border p-2 rounded"
                />
                <button type="submit" className="bg-[#bada55] text-[#333333] px-4 py-2 rounded font-bold">
                Create Poll
                </button>
            </form>
            </div>
            {/* Existing Polls Grid */}
            <div>
            <h2 className="text-xl font-bold mb-4">Existing Polls</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {polls.map(poll => (
                <div key={poll.id} className="border p-4 rounded">
                    <div className="mb-2">
                    <strong>Question:</strong> {poll.question}
                    </div>
                    <div className="mb-2">
                    <strong>Time Left:</strong> {poll.timeLeft}
                    </div>
                    <div className="mb-2">
                      <strong>Is Live:</strong>{' '}
                      <span className={poll.isLive ? 'text-green-600' : 'text-red-600'}>
                        {poll.isLive ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="mb-2">
                    <strong>Options:</strong>
                    <ul className="list-disc ml-6">
                        {poll.options.map((option, index) => (
                        <li key={index}>
                            {option.text} (Votes: {option.votes})
                        </li>
                        ))}
                    </ul>
                    </div>
                    <div className="flex gap-2">
                    <button
                        onClick={() => setPollEditModal({ isOpen: true, poll })}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Edit
                    </button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </>
        )}


      {activeTab === 'reviews' && <ReviewTab />}

      {/* Modals */}
      {restaurantToEdit && (
        <EditRestaurantModal
          restaurant={restaurantToEdit}
          onClose={() => setRestaurantToEdit(null)}
          onUpdate={handleUpdateRestaurant}
          onDelete={handleDeleteRestaurant}
        />
      )}
      {showManageDishesModal && selectedRestaurantForDishes && (
        <ManageDishesModal
          restaurantId={selectedRestaurantForDishes}
          dishes={dishesForRestaurant}
          onClose={() => setShowManageDishesModal(false)}
          onRefresh={() => fetchDishes(selectedRestaurantForDishes)}
        />
      )}
      {pollEditModal.isOpen && (
        <PollEditModal
          poll={pollEditModal.poll}
          onClose={() => setPollEditModal({ isOpen: false, poll: null })}
          onUpdate={handleUpdatePoll}
          onDelete={handleDeletePoll}
        />
      )}

      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'suggestions' && <SuggestionTab />}

    </div>
  );
}
