import React from 'react'
import useAdStore from '../store/adStore'
import { motion, AnimatePresence } from 'framer-motion'

const panelVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: '0%', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.25 } },
}

const SettingsPanel = () => {
  const selectedAd = useAdStore((s) => s.selectedAd)
  const isOpen = useAdStore((s) => s.isSettingsPanelOpen)
  const close = useAdStore((s) => s.closeSettings)

  return (
    <AnimatePresence>
      {isOpen && selectedAd && (
        <motion.div
          className="p-4 bg-white rounded-md shadow-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
        >
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold">Ad Details</h2>
            <button onClick={close} className="text-sm text-gray-500 hover:text-gray-800">Close</button>
          </div>

          <img src={selectedAd.imageUrl} alt={selectedAd.title} className="w-full h-40 object-cover rounded-md mt-3" />

          <h3 className="mt-3 font-medium">{selectedAd.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{selectedAd.description}</p>

          <div className="mt-4 text-sm text-gray-700">
            <div>CTR: {selectedAd.metrics?.ctr}%</div>
            <div>CPC: ${selectedAd.metrics?.cpc}</div>
          </div>

          <div className="mt-4">
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md">Apply Variation</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SettingsPanel
