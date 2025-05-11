// src/admin/UsersTab.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const normalizeStatus = (status) => {
    if (!status) return 'active';
    return status.toLowerCase() === 'banned' ? 'banned' : 'active';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Users'));
        const data = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
          status: normalizeStatus(docSnap.data().status),
        }));
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const queryLower = searchQuery.toLowerCase();
    setFilteredUsers(
      users.filter(user =>
        (user.name?.toLowerCase().includes(queryLower)) ||
        (user.email?.toLowerCase().includes(queryLower))
      )
    );
  }, [searchQuery, users]);

  const handleToggleBan = async (user) => {
    const newStatus = user.status === 'active' ? 'banned' : 'active';
    try {
      const userRef = doc(db, 'Users', user.id);
      await updateDoc(userRef, { status: newStatus });
      setUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u)
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email or name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredUsers.map(user => {
            const isBanned = normalizeStatus(user.status) === 'banned';
            return (
              <div key={user.id} className="border p-4 rounded shadow flex flex-col items-start">
                {user.profileImage && (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-16 h-16 rounded-full mb-2 object-cover"
                  />
                )}
                <h3 className={`text-lg font-bold ${isBanned ? 'text-red-600' : ''}`}>
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
                <p className="text-sm">
                  Status:{' '}
                  <span className={isBanned ? 'text-red-600' : 'text-green-600'}>
                    {isBanned ? 'Banned' : 'Active'}
                  </span>
                </p>
                <button
                  onClick={() => handleToggleBan(user)}
                  className={`mt-3 px-3 py-1 rounded font-semibold ${
                    isBanned
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {isBanned ? 'Unban' : 'Ban'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
