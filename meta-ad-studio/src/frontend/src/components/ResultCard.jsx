import React from 'react'

const ResultCard = ({ result }) => {
  if (!result) return null

  return (
    <article className="bg-gray-800 rounded overflow-hidden shadow-lg relative focus-within:ring-2 focus-within:ring-accent" tabIndex={0} aria-labelledby={`title-${result.id || Math.random()}`}>
      <img
        src={result.image || ''}
        alt={result.title || 'result'}
        className="w-full object-cover"
        loading="lazy"
        style={{ aspectRatio: '3/2' }}
      />
      <div className="p-3">
        <h3 id={`title-${result.id || Math.random()}`} className="text-white text-sm truncate">
          {result.title || 'Ad result'}
        </h3>
      </div>

      {/* Overlay actions (accessible via keyboard focus and hover) */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 group-focus-within:bg-black/30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <div className="flex gap-2" role="group" aria-label="result actions">
          <button className="bg-white/10 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-accent">Open</button>
          <button className="bg-white/10 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-accent">Share</button>
        </div>
      </div>
    </article>
  )
}

export default ResultCard
