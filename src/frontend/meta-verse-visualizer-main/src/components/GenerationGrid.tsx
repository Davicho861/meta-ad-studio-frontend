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
  selectedResultId?: number | string | null
  onSelect?: (id: number | string) => void
  onUpscale?: (id: number | string) => void
  onVariation?: (id: number | string) => void
  onReroll?: (id: number | string) => void
}

export const GenerationGrid = ({
  results,
  isGenerating = false,
  onVisualize,
  selectedResultId,
  onSelect,
  onUpscale,
  onVariation,
  onReroll,
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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr'>
        {displayResults.map((result, index) => (
          <div
            key={result.id}
            className='relative group animate-fade-in-up'
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ResultCardV2
              result={result}
              onVisualize={onVisualize}
              selected={selectedResultId === result.id}
              onSelect={onSelect}
            />

            {/* Overlay de acciones que aparece al hacer hover */}
            <div className='pointer-events-none absolute inset-2 flex items-end justify-end opacity-0 group-hover:opacity-100 transition-opacity'>
              <div className='bg-black/50 rounded-md p-2 backdrop-blur-sm pointer-events-auto flex gap-2'>
                <button
                  className='text-white px-2 py-1 rounded bg-accent-purple/80'
                  onClick={() => {
                    onSelect?.(result.id)
                    onUpscale?.(result.id)
                  }}
                  title='Upscale (U)'
                >
                  U
                </button>

                <button
                  className='text-white px-2 py-1 rounded bg-accent-green/80'
                  onClick={() => {
                    onSelect?.(result.id)
                    onVariation?.(result.id)
                  }}
                  title='Variation (V)'
                >
                  V
                </button>

                <button
                  className='text-white px-2 py-1 rounded bg-accent-blue/80'
                  onClick={() => {
                    onSelect?.(result.id)
                    onReroll?.(result.id)
                  }}
                  title='Re-roll'
                >
                  Re-roll
                </button>
              </div>
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
