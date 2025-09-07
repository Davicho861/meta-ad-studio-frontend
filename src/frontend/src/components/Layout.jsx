import React from 'react'
import PromptBar from './prompting/PromptBar'
import ResultsGrid from './generation/ResultsGrid'
import SettingsPanel from './SettingsPanel'
import HistorySidebar from './HistorySidebar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Generative Ad Studio (Prototype)</h1>
        </header>

        <section className="mb-4">
          <PromptBar />
        </section>

        <main className="grid grid-cols-12 gap-6">
          <aside className="col-span-2 bg-white p-4 rounded-md shadow-sm">
            <HistorySidebar />
          </aside>

          <section className="col-span-7 bg-white p-4 rounded-md shadow-sm">
            <ResultsGrid />
          </section>

          <aside className="col-span-3">
            <SettingsPanel />
          </aside>
        </main>
      </div>
    </div>
  )
}

export default Layout

