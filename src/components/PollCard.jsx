// src/components/PollCard.jsx
import React from 'react';

export default function PollCard({ poll, onOptionChange, onVote }) {
  // Calculate percentage for each option
  function getPercentage(votes) {
    return poll.totalVotes === 0 ? 0 : Math.round((votes / poll.totalVotes) * 100);
  }

  return (
    <div className="bg-white shadow-md rounded p-4">
      <div className="mb-2 text-lg font-bold text-gray-800">{poll.question}</div>

      {/* Sub-info row: time left, live status, total votes */}
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-600">{poll.timeLeft}</span>
        <div className="flex items-center gap-2">
          {poll.isLive && <span className="text-green-500">● Live</span>}
          <span className="text-gray-600">{poll.totalVotes} votes</span>
        </div>
      </div>

      {!poll.userVoted ? (
        <div className="flex flex-col gap-2">
          {poll.options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 rounded px-3 py-2 cursor-pointer"
            >
              <input
                type="radio"
                name={`poll-${poll.id}`}
                value={option.id}
                checked={poll.selectedOption === option.id}
                onChange={() => onOptionChange(poll.id, option.id)}
                className="form-radio text-gray-600"
              />
              <span className="text-gray-800">{option.text}</span>
            </label>
          ))}
          <button
            onClick={() => onVote(poll.id)}
            className="mt-auto item-end mt-2 bg-gray-800 text-white font-bold px-4 py-2 rounded hover:bg-gray-700"
          >
            Vote
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {poll.options.map((option) => {
            const pct = getPercentage(option.votes);
            const isSelected = poll.selectedOption === option.id;
            return (
              <div key={option.id}>
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded ${
                    isSelected ? 'bg-gray-300' : 'bg-gray-200'
                  }`}
                >
                  <span className="text-gray-800">{option.text}</span>
                  <span className="text-gray-800">{pct}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-300 h-2 rounded-b mb-2">
                  <div
                    className="bg-gray-400 h-2 rounded-b"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
