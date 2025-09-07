import React from 'react'
import TopBar from '../components/TopBar'
import ResultsGrid from '../components/ResultsGrid'

const sample = new Array(9).fill(0).map((_, i) => ({
  id: String(i),
  title: `Sample ${i + 1}`,
  thumbnail: '/placeholder.png',
}))

export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white'>
      <TopBar />
      <main className='max-w-7xl mx-auto py-6'>
        <ResultsGrid items={sample} />
      </main>
    </div>
  )
}
