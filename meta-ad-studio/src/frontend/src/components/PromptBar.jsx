import React from 'react'
import useAdStore from '../store/adStore'
import { motion } from 'framer-motion'

const PromptBar = () => {
  const prompt = useAdStore((s) => s.prompt)
  const setPrompt = useAdStore((s) => s.setPrompt)
  const generateAds = useAdStore((s) => s.generateAds)
  const isLoading = useAdStore((s) => s.isLoading)

  const handleInputChange = (e) => setPrompt(e.target.value)

  const handleSubmit = () => {
    if (prompt && prompt.trim()) {
      generateAds()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex items-center p-4 bg-gray-900 shadow-lg rounded-lg">
      <input
        aria-label="ad-prompt"
        type="text"
        value={prompt}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Describe el anuncio que quieres generar..."
        className="flex-grow p-4 border border-gray-700 rounded-md mr-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <motion.button
        onClick={handleSubmit}
        whileTap={{ scale: 0.98 }}
        animate={isLoading ? { scale: [1, 1.02, 1], transition: { duration: 0.8, repeat: Infinity } } : { scale: 1 }}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        disabled={!prompt.trim() || isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </motion.button>
    </div>
  )
}

export default PromptBar