import React from 'react'
import PromptBar from './prompting/PromptBar'
import ResultsGrid from './generation/ResultsGrid'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Generative Ad Studio (Prototype)</h1>
          </div>

          {/* Skip link for keyboard users */}
          <a href="#results" className="sr-only focus:not-sr-only focus:inline-block mt-2 text-sm underline text-accent-500">Saltar a resultados</a>

          {/* Centralized prompt bar for the immersive canvas flow */}
          <div className="mt-4">
            <PromptBar />
          </div>
        </header>

        <main>
          <section className="bg-white p-4 rounded-md shadow-sm">
            <ResultsGrid />
          </section>
        </main>
      </div>
    </div>
  )
}

export default Layout

