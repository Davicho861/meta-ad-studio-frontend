import React from 'react'
import { motion } from 'framer-motion'
import useAdStore from '../store/adStore'
import ResultCard from './ResultCard'

const GenerationGrid = () => {
  const results = useAdStore((state) => state.results)
  const isLoading = useAdStore((state) => state.isLoading)

  return (
    <div className="p-4 w-full">
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="masonry-columns">
          {results.map((result, index) => (
            <div key={index} className="mb-4 group focus-within:ring-2 focus-within:ring-accent relative">
              <ResultCard result={result} />
              <div className="absolute inset-0 flex items-end justify-center p-2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded px-2 py-1 text-white text-xs pointer-events-auto">
                  Actions
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GenerationGrid