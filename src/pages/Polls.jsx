// src/pages/Polls.jsx
import React, { useState, useEffect } from 'react';
import PollCard from '../components/PollCard';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Polls({ isLoggedIn, currentUserEmail }) {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  // Fetch polls from Firestore on mount
  useEffect(() => {
    async function fetchPolls() {
      try {
        const querySnapshot = await getDocs(collection(db, 'Polls'));
        const pollsData = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          // Determine if current user has voted by checking if their email is in the users map.
          const userVote = currentUserEmail && data.users ? data.users[currentUserEmail] : null;
          return {
            id: docSnap.id,
            ...data,
            userVoted: userVote !== null && userVote !== undefined,
            selectedOption: userVote ?? null, // stored as number if voted
          };
        });
        setPolls(pollsData);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    }
    fetchPolls();
  }, [currentUserEmail]);

  // Called when the user selects an option (radio button)
  // optionValue is now the index (number) of the option selected.
  function handleOptionChange(pollId, optionValue) {
    setPolls(prevPolls =>
      prevPolls.map(poll =>
        poll.id === pollId && !poll.userVoted
          ? { ...poll, selectedOption: optionValue }
          : poll
      )
    );
  }

  // Called when the user clicks "Vote"
  async function handleVote(pollId) {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    // Must be logged in.
    if (!isLoggedIn) {
      alert('You must be logged in to vote.');
      navigate('/sign-in');
      return;
    }

    // If the user has already voted, do not allow voting again.
    if (poll.userVoted) {
      alert('You have already voted on this poll.');
      return;
    }

    // Check if poll is still active (using isLive or another criteria)
    if (!poll.isLive) {
      alert('This poll is no longer active.');
      return;
    }

    // Must select an option
    if (poll.selectedOption === null || poll.selectedOption === undefined) {
      alert('Please select an option before voting.');
      return;
    }

    try {
      // Update the options array by incrementing the votes for the chosen option.
      const updatedOptions = poll.options.map((option, idx) => {
        if (idx === poll.selectedOption) {
          const newVoteCount = Number(option.votes) + 1;
          return { ...option, votes: newVoteCount.toString() };
        }
        return option;
      });

      // Update the users map: store the selected option index.
      const updatedUsers = { ...(poll.users || {}) };
      updatedUsers[currentUserEmail] = poll.selectedOption;

      // Reference to the poll document in Firestore.
      const pollRef = doc(db, 'Polls', pollId);
      await updateDoc(pollRef, {
        options: updatedOptions,
        users: updatedUsers,
      });

      // Update local state.
      setPolls(prevPolls =>
        prevPolls.map(p =>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {polls.map(poll => (
          <PollCard
            key={poll.id}
            poll={poll}
            onOptionChange={(id, optionValue) => handleOptionChange(id, optionValue)}
            onVote={() => handleVote(poll.id)}
            currentUserEmail={currentUserEmail}
          />
        ))}
      </div>
    </div>
  );
}
