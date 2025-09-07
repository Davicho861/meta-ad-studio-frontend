import React, { useState, useEffect } from 'react'
import { FilterSidebar } from '../components/FilterSidebar'
import VideoCard from '../components/VideoCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { videoExamples } from '../data/gallery-examples'

export const ExplorePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className='flex w-full h-full bg-background-dark'>
      <aside className='hidden lg:block w-72 border-r border-surface-dark/50 p-4'>
        <FilterSidebar />
      </aside>

      <main className='flex-1 p-4 md:p-8 overflow-y-auto'>
        <div className='max-w-7xl mx-auto'>
          <header className='mb-8'>
            <h1 className='text-4xl font-bold text-white tracking-tight'>
              Explorar Campañas
            </h1>
            <p className='text-secondary-text mt-2'>
              Galería inmersiva de campañas generadas por IA. Pasa el cursor
              para reproducir.
            </p>
          </header>

          <section>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : videoExamples.map((v) => <VideoCard key={v.id} result={v} />)}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
