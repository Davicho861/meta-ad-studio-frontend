import React from 'react'
import { motion } from 'framer-motion'
import useAdStore from '../store/adStore'
import ResultCard from './ResultCard'

const GenerationGrid = () => {
  const results = useAdStore((state) => state.results)
  const isLoading = useAdStore((state) => state.isLoading)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {isLoading ? (
        <div className="col-span-full text-center">Loading...</div>
      ) : (
        results.map((result, index) => (
          <motion.div key={index} className="relative">
            <ResultCard result={result} />
          </motion.div>
        ))
      )}
    </div>
  )
}

export default GenerationGrid