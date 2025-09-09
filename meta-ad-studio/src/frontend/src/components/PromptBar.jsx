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
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex items-center bg-gray-900/60 backdrop-blur-md p-3 rounded-xl shadow-lg">
        <label htmlFor="ad-prompt" className="sr-only">Prompt</label>
        <input
          id="ad-prompt"
          aria-label="ad-prompt"
          type="text"
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe el anuncio que quieres generar..."
          className="flex-grow p-3 border border-gray-700 rounded-md mr-4 bg-gray-800/60 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          disabled={isLoading}
        />
        <motion.button
          onClick={handleSubmit}
          whileTap={{ scale: 0.98 }}
          animate={isLoading ? { scale: [1, 1.02, 1], transition: { duration: 0.8, repeat: Infinity } } : { scale: 1 }}
          className="px-5 py-2 bg-accent text-white font-semibold rounded-md hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </motion.button>
      </div>
    </div>
  )
}

export default PromptBar