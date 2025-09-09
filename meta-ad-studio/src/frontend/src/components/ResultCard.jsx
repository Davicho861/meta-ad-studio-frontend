import React from 'react'

const ResultCard = ({ result }) => {
  // Cambio temporal para probar HMR: añadimos timestamp render
  if (!result) return null

  return (
    <div className="bg-gray-800 rounded overflow-hidden shadow-lg">
      <img src={result.image || ''} alt={result.title || 'result'} className="w-full object-cover h-48" />
      <div className="p-2">
        <h3 className="text-white text-sm truncate">{result.title || 'Ad result'}</h3>
        <p className="text-xs text-gray-400">Updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}

export default ResultCard
