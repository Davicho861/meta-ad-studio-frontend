import React from 'react'
import ResultsGrid from '../components/generator/ResultsDisplay'
import PromptBar from '../components/generator/PromptBar'
import SettingsMenu from '../components/layout/SettingsMenu'

const DashboardPage: React.FC = () => {
  return (
    <div className="h-screen w-full bg-[#1a1a1a] text-[#e0e0e0] relative">
      {/* ResultsGrid como contenido principal */}
      <ResultsGrid />

      {/* PromptBar fijo en la parte inferior */}
      <PromptBar />

      {/* SettingsMenu fijo en la esquina superior derecha */}
      <SettingsMenu />
    </div>
  )
}

export default DashboardPage
