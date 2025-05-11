// src/pages/Polls.jsx
import React, { useState, useEffect } from 'react';
import PollCard from '../components/PollCard';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Polls({ isLoggedIn, currentUserEmail }) {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  // Fetch live polls from Firestore on mount
  useEffect(() => {
    async function fetchPolls() {
      try {
        const querySnapshot = await getDocs(collection(db, 'Polls'));
        const pollsData = querySnapshot.docs
          .map(docSnap => {
            const data = docSnap.data();
            const userVote = currentUserEmail && data.users
              ? data.users[currentUserEmail]
              : null;
            return {
              id: docSnap.id,
              ...data,
              userVoted: userVote !== null && userVote !== undefined,
              selectedOption: userVote ?? null,
            };
          })
          // only keep ones still live
          .filter(poll => poll.isLive);
        setPolls(pollsData);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    }
    fetchPolls();
  }, [currentUserEmail]);

  function handleOptionChange(pollId, optionValue) {
    setPolls(prev =>
      prev.map(p =>
        p.id === pollId && !p.userVoted
          ? { ...p, selectedOption: optionValue }
          : p
      )
    );
  }

  async function handleVote(pollId) {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    if (!isLoggedIn) {
      alert('You must be logged in to vote.');
      navigate('/sign-in');
      return;
    }
    if (poll.userVoted) {
      alert('You have already voted on this poll.');
      return;
    }
    if (!poll.isLive) {
      alert('This poll is no longer active.');
      return;
    }
    if (poll.selectedOption === null || poll.selectedOption === undefined) {
      alert('Please select an option before voting.');
      return;
    }

    try {
      const updatedOptions = poll.options.map((opt, idx) =>
        idx === poll.selectedOption
          ? { ...opt, votes: (Number(opt.votes) + 1).toString() }
          : opt
      );
      const updatedUsers = { ...(poll.users || {}) };
      updatedUsers[currentUserEmail] = poll.selectedOption;

      const pollRef = doc(db, 'Polls', pollId);
      await updateDoc(pollRef, {
        options: updatedOptions,
        users: updatedUsers,
      });

      setPolls(prev =>
        prev.map(p =>
          p.id === pollId
            ? { ...p, options: updatedOptions, users: updatedUsers, userVoted: true }
            : p
        )
      );
    } catch (error) {
      console.error('Error voting on poll:', error);
      alert('Error voting on poll. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Dining Polls</h1>
      <div className="grid grid-cols-1 min-[650px]:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {polls.map(poll => (
          <PollCard
            key={poll.id}
            poll={poll}
            onOptionChange={(id, val) => handleOptionChange(id, val)}
            onVote={() => handleVote(poll.id)}
            currentUserEmail={currentUserEmail}
          />
        ))}
      </div>
    </div>
  );
}
