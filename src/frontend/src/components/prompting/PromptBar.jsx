import React, { useEffect, useRef } from 'react'
import useAdStore from '../store/adStore'
import { motion } from 'framer-motion'

const PromptBar = () => {
  const prompt = useAdStore((s) => s.prompt)
  const setPrompt = useAdStore((s) => s.setPrompt)
  const generateAds = useAdStore((s) => s.generateAds)
  const isLoading = useAdStore((s) => s.isLoading)

  const inputRef = useRef(null)

  const handleInputChange = (e) => setPrompt(e.target.value)

  const handleSubmit = () => {
    if (prompt && prompt.trim()) {
      generateAds()
    }
  }

  const handleKeyDown = (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    if ((e.ctrlKey || (isMac && e.metaKey)) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      setPrompt('')
    }
  }

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.addEventListener('keydown', handleKeyDown)
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [prompt])

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="flex items-center p-4 app-surface shadow-md rounded-xl"
      aria-describedby="prompt-help"
    >
      <input
        ref={inputRef}
        aria-label="ad-prompt"
        id="ad-prompt"
        type="text"
        value={prompt}
        onChange={handleInputChange}
        placeholder="Describe el anuncio que quieres generar... (Ctrl/Cmd+Enter para generar)"
        className="flex-grow p-3 bg-transparent border border-transparent focus:border-muted-400 rounded-lg mr-4 focus:outline-none focus:ring-2 focus:ring-accent-500 placeholder:muted"
        disabled={isLoading}
      />

      <motion.button
        type="submit"
        onClick={handleSubmit}
        whileTap={{ scale: 0.98 }}
        animate={isLoading ? { scale: [1, 1.02, 1], transition: { duration: 0.8, repeat: Infinity } } : { scale: 1 }}
        className="px-5 py-2 bg-accent-500 text-white font-semibold rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-300 disabled:opacity-50"
        disabled={!prompt.trim() || isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </motion.button>

      <div id="prompt-help" className="sr-only">
        Escribe tu prompt y presiona Enter o Ctrl/Cmd+Enter para generar anuncios.
      </div>
    </form>
  )
}

export default PromptBar
