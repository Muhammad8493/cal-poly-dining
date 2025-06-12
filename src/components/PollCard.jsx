// src/components/PollCard.jsx
import React from 'react';

function getTotalVotes(options) {
  return options.reduce((sum, opt) => sum + Number(opt.votes), 0);
}

export default function PollCard({ poll, onOptionChange, onVote, currentUserEmail }) {
  const totalVotes = getTotalVotes(poll.options);
  const userVoted = poll.userVoted;

  function getPercentage(voteCount) {
    return totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
  }

  return (
    <div className="bg-white shadow-md rounded p-4">
      <div className="mb-2 text-lg font-bold text-gray-800">{poll.question}</div>

      {/* Sub-info row: time left, live status, computed total votes */}
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-600">{poll.timeLeft}</span>
        <div className="flex items-center gap-2">
          {poll.isLive && <span className="text-green-500">● Live</span>}
          <span className="text-gray-600">{totalVotes} votes</span>
        </div>
      </div>

      {!userVoted ? (
        <div className="flex flex-col gap-2">
          {poll.options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 rounded px-3 py-2 cursor-pointer"
            >
              <input
                type="radio"
                name={`poll-${poll.id}`}
                checked={poll.selectedOption === idx}
                onChange={() => onOptionChange(poll.id, idx)}
                className="form-radio text-gray-600"
              />
              <span className="text-gray-800">{option.text}</span>
            </label>
          ))}
          <button
            onClick={onVote}
            className="mt-2 bg-gray-800 text-white font-bold px-4 py-2 rounded hover:bg-gray-700"
          >
            Vote
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {poll.options.map((option, idx) => {
            const voteCount = Number(option.votes);
            const pct = getPercentage(voteCount);
            const isUserChoice = poll.users && poll.users[currentUserEmail] === idx;
            return (
              <div key={idx}>
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded ${
                    isUserChoice ? 'bg-green-200' : 'bg-gray-200'
                  }`}
                >
                  <span className="text-gray-800">{option.text}</span>
                  <span className="text-gray-800">{pct}%</span>
                </div>
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
