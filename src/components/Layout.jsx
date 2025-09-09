import React from 'react'
import PromptBar from './PromptBar'
import ResultsGrid from './ResultsGrid'
import SettingsPanel from './SettingsPanel'
import HistorySidebar from './HistorySidebar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="min-h-screen w-full h-full flex flex-col">
        {/* PromptBar centered at top */}
        <header className="w-full flex justify-center pt-6 px-4">
          <div className="w-full max-w-4xl">
            <PromptBar />
          </div>
        </header>

        {/* Main immersive area: generation grid fills remaining space */}
        <main className="flex-1 overflow-auto p-6">
          <div className="w-full max-w-7xl mx-auto">
            <ResultsGrid />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

