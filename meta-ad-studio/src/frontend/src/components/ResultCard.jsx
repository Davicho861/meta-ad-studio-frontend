import React from 'react';

const ResultCard = ({ image, onReRoll, onUpvote, onDownvote }) => {
  return (
    <div className="relative group border border-gray-300 rounded-lg overflow-hidden shadow-md">
      <img src={image} alt="Generated result" className="w-full h-auto" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-2">
          <button onClick={onUpvote} className="bg-blue-500 text-white px-3 py-1 rounded-md">U</button>
          <button onClick={onDownvote} className="bg-red-500 text-white px-3 py-1 rounded-md">V</button>
          <button onClick={onReRoll} className="bg-yellow-500 text-white px-3 py-1 rounded-md">Re-roll</button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;