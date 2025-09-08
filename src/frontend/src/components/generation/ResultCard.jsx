import React from 'react';

const ResultCard = ({ image, onReRoll, onUpvote, onDownvote }) => {
  return (
    <div className="relative group rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-midnight-900 to-midnight-800">
      <img src={image} alt="Generated result" className="w-full h-auto object-cover" loading="lazy" />

      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
        <div className="bg-black bg-opacity-50 rounded-md px-3 py-2 flex items-center space-x-2">
          <button onClick={onUpvote} aria-label="Upvote" className="text-white px-2 py-1 rounded hover:bg-white/10">👍</button>
          <button onClick={onDownvote} aria-label="Downvote" className="text-white px-2 py-1 rounded hover:bg-white/10">👎</button>
          <button onClick={onReRoll} aria-label="Re-roll" className="text-white px-3 py-1 rounded bg-accent-500 hover:brightness-110">Re-roll</button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;