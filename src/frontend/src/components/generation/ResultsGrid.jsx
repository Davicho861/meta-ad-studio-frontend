import React from 'react'
import useAdStore from '../store/adStore'
import ResultCard from './ResultCard'
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const ResultsGrid = () => {
  const generatedAds = useAdStore((s) => s.generatedAds)
  const isLoading = useAdStore((s) => s.isLoading)
  const generationProgress = useAdStore((s) => s.generationProgress)

  if (isLoading) {
    return (
      <div className="columns-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-4 rounded-md animate-pulse h-48 bg-gradient-to-br from-midnight-900 to-midnight-800" />
        ))}
      </div>
    )
  }

  if (!generatedAds || generatedAds.length === 0) {
    return (
      <div>
        {generationProgress && generationProgress.logs && generationProgress.logs.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 border rounded text-sm">
            <div className="font-medium mb-1">Generation progress</div>
            <div className="text-xs text-gray-600 max-h-40 overflow-auto">
              {generationProgress.logs.map((l, i) => (
                <div key={i}>{String(l)}</div>
              ))}
            </div>
          </div>
        )}

  <div className="text-gray-500">Aún no hay anuncios. Introduce un prompt y genera.</div>
      </div>
    )
  }

  return (
    <motion.div
      className="columns-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {generatedAds.map((ad) => (
        <div key={ad.id} className="break-inside-avoid mb-4">
          <ResultCard image={ad.imageUrl || ad.image} onReRoll={() => {}} onUpvote={() => {}} onDownvote={() => {}} />
        </div>
      ))}
    </motion.div>
  )
}

export default ResultsGrid
