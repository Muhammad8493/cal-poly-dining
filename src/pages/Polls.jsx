// src/pages/Polls.jsx
import React, { useState } from 'react';
import PollCard from '../components/PollCard';

export default function Polls() {
  // Example polls data
  const [polls, setPolls] = useState([
    {
      id: 1,
      question: 'Which dish is your favorite?',
      options: [
        { id: 1, text: 'Burger', votes: 10 },
        { id: 2, text: 'Pizza', votes: 15 },
        { id: 3, text: 'Salad', votes: 5 },
        { id: 4, text: 'Pasta', votes: 8 },
      ],
      totalVotes: 38, // sum of votes
      isLive: true,
      timeLeft: '3 days left',
      userVoted: false,
      selectedOption: null,
    },
    {
      id: 2,
      question: 'Which dish do you want to return?',
      options: [
        { id: 1, text: 'Pumpkin Spice Latte', votes: 20 },
        { id: 2, text: 'Sourdough Bread Bowl', votes: 12 },
        { id: 3, text: 'Tofu Stir-Fry', votes: 7 },
        { id: 4, text: 'Chicken Bowl', votes: 7 },
      ],
      totalVotes: 49,
      isLive: true,
      timeLeft: '5 days left',
      userVoted: false,
      selectedOption: null,
    },
    {
        id: 3,
        question: 'Which new dish do you like?',
        options: [
          { id: 1, text: 'Burger', votes: 10 },
          { id: 2, text: 'Pizza', votes: 15 },
          { id: 3, text: 'Salad', votes: 5 },
          { id: 4, text: 'Pasta', votes: 8 },
          
        ],
        totalVotes: 18, // sum of votes
        isLive: true,
        timeLeft: '3 days left',
        userVoted: false,
        selectedOption: null,
      },
      {
        id: 4,
        question: 'How do you like the current food options?',
        options: [
          { id: 1, text: 'Terrible', votes: 20 },
          { id: 2, text: 'Bad', votes: 12 },
          { id: 3, text: 'Okay', votes: 7 },
          { id: 4, text: 'Good', votes: 7 },
          { id: 4, text: 'Great', votes: 7 },

        ],
        totalVotes: 53,
        isLive: true,
        timeLeft: '5 days left',
        userVoted: false,
        selectedOption: null,
      },
  ]);

  // Handle when user selects an option before voting
  function handleOptionChange(pollId, optionId) {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id !== pollId ? poll : { ...poll, selectedOption: optionId }
      )
    );
  }

  // Handle when user clicks "Vote"
  function handleVote(pollId) {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.userVoted || poll.selectedOption == null) return poll;
        const updatedOptions = poll.options.map((option) =>
          option.id === poll.selectedOption
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
          userVoted: true,
        };
      })
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Dining Polls</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {polls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            onOptionChange={handleOptionChange}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}
