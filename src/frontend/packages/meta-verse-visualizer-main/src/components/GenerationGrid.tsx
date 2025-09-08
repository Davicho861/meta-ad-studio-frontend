import React from 'react'
import { ResultCardV2 } from './ResultCardV2'

interface GenerationResult {
  id: number
  imageUrl?: string
  prompt: string
  isLoading: boolean
  progress: number
}

interface GenerationGridProps {
  results: GenerationResult[]
  isGenerating?: boolean
  onVisualize?: (payload: { sceneId?: string; imageUrl?: string }) => void
}

export const GenerationGrid = ({
  results,
  isGenerating = false,
  onVisualize,
}: GenerationGridProps) => {
  // Si está generando y no hay resultados previos, mostrar placeholders de carga
  const displayResults =
    isGenerating && results.length === 0
      ? Array.from({ length: 4 }, (_, i) => ({
          id: `loading-${i}`,
          imageUrl: '',
          prompt: '',
          isLoading: true,
          progress: 0,
        }))
      : results

  return (
    <div className='w-full p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {displayResults.map((result, index) => (
          <div
            key={result.id}
            className='animate-fade-in-up'
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div tabIndex={0} aria-live={result.isLoading ? 'polite' : undefined}>
              <ResultCardV2 result={result} onVisualize={onVisualize} />
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !isGenerating && (
        <div className='text-center py-12'>
          <p className='text-secondary-text text-lg'>
            No hay resultados aún. ¡Genera tu primera imagen!
          </p>
        </div>
      )}
    </div>
  )
}
