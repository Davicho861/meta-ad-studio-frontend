import React, { useEffect, useRef, useState } from 'react'
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
  const [localAds, setLocalAds] = useState([])
  const sentinelRef = useRef(null)

  useEffect(() => {
    setLocalAds(generatedAds)
  }, [generatedAds])

  // Simple demo infinite loader: when sentinel appears, duplicate current items once
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && localAds && localAds.length > 0 && !isLoading) {
          // duplicate items with new ids for visual testing only
          const more = localAds.map((a, i) => ({ ...a, id: `${a.id}-dup-${Date.now()}-${i}` }))
          setLocalAds((s) => s.concat(more))
        }
      })
    }, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [localAds, isLoading])

  if (isLoading) {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4" data-testid="results-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-4 rounded-md animate-pulse h-48 bg-gradient-to-br from-midnight-900 to-midnight-800" />
        ))}
      </div>
    )
  }

  if (!localAds || localAds.length === 0) {
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
      className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
      data-testid="results-grid"
    >
      {localAds.map((ad) => (
        <div key={ad.id} data-testid="result-card" className="break-inside-avoid mb-4">
          <ResultCard image={ad.imageUrl || ad.image} onReRoll={() => {}} onUpvote={() => {}} onDownvote={() => {}} />
        </div>
      ))}

      {/* sentinel for infinite loading demo */}
      <div ref={sentinelRef} className="h-8 w-full" aria-hidden="true" />
    </motion.div>
  )
}

export default ResultsGrid
