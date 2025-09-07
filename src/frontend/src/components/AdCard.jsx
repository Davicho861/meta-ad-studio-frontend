import React from 'react'
import useAdStore from '../store/adStore'
import { motion } from 'framer-motion'

const item = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const AdCard = ({ ad }) => {
  const selectAd = useAdStore((s) => s.selectAd)

  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      role="button"
      tabIndex={0}
      onClick={() => selectAd(ad)}
      onKeyDown={(e) => e.key === 'Enter' && selectAd(ad)}
      className="border rounded-md overflow-hidden cursor-pointer hover:shadow-lg bg-white"
    >
      <img src={ad.imageUrl} alt={ad.title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h3 className="font-medium">{ad.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{ad.description}</p>
        <div className="mt-2 text-xs text-gray-500">CTR: {ad.metrics?.ctr}% • CPC: ${ad.metrics?.cpc}</div>
      </div>
    </motion.div>
  )
}

export default AdCard
