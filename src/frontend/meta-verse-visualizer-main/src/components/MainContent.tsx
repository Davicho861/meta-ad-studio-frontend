import React, { useState, useRef, useEffect } from 'react'
import VisualizationStage from './VisualizationStage'
import { PromptBarV2 } from './PromptBarV2'
import { InspirationCarousel } from './InspirationCarousel'
import { SceneSelector } from './SceneSelector'
import { GenerationGrid } from './GenerationGrid'
import toast from 'react-hot-toast'

interface GenerationResult {
  id: number
  imageUrl?: string
  prompt: string
  isLoading: boolean
  progress: number
}

interface MainContentProps {
  inspirationData: Array<{
    id: number
    title: string
    location: string
    imageUrl: string
    prompt: string
  }>
  isLoading: boolean
}

const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-semibold rounded-md transition-colors ${active ? 'bg-surface-dark text-primary-text' : 'text-secondary-text hover:bg-surface-dark/50'}`}
  >
    {label}
  </button>
)

export const MainContent = ({
  inspirationData,
  isLoading,
}: MainContentProps) => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<GenerationResult[]>([])
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null)
  // viewState controla si estamos en el Creation Hub o en la vista Visualization
  const [viewState, setViewState] = useState<{
    view: 'creation' | 'visualization'
    payload: unknown | null
  }>({ view: 'creation', payload: null })
  const [activeTab, setActiveTab] = useState('inspiracion')
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePromptClick = (selectedPrompt: string) => {
    setPrompt(selectedPrompt)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSceneSelect = (sceneName: string) => {
    setPrompt(`Un anuncio en ${sceneName} sobre `)
    promptTextareaRef.current?.focus()
  }

  const handleGenerate = () => {
    if (!prompt) return
    setIsGenerating(true)
    const newResult: GenerationResult = {
      id: Date.now(),
      prompt,
      isLoading: true,
      progress: 0,
    }
    setResults((prev) => [newResult, ...prev])

    // Simular progreso
    const interval = setInterval(() => {
      setResults((prev) =>
        prev.map((result) =>
          result.id === newResult.id && result.progress < 100
            ? { ...result, progress: result.progress + 10 }
            : result
        )
      )
    }, 300)

    // Simular finalización
    setTimeout(() => {
      clearInterval(interval)
      setResults((prev) =>
        prev.map((result) =>
          result.id === newResult.id
            ? {
                ...result,
                isLoading: false,
                imageUrl: '/assets/generated-image.jpg',
              } // Placeholder
            : result
        )
      )
      setIsGenerating(false)
    }, 3000)
  }

  // Atajos de teclado: U (Upscale), V (Variation), R (Re-roll)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      const target = e.target as HTMLElement
      const tag = target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || (target?.isContentEditable)) return

      const key = e.key.toLowerCase()
      if (!selectedResultId) return

      if (key === 'u') {
        console.log('Shortcut Upscale', selectedResultId)
      } else if (key === 'v') {
        console.log('Shortcut Variation', selectedResultId)
      } else if (key === 'r') {
        console.log('Shortcut Re-roll', selectedResultId)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedResultId])

  // Handlers que llaman a endpoints backend (stubs seguros)
  const handleUpscale = async (id: number | string) => {
    const result = results.find((r) => String(r.id) === String(id))
    if (!result?.imageUrl) return toast.error('Imagen no disponible para upscale')
    toast.loading('Solicitando upscale...')
    try {
      const resp = await fetch('/api/v1/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, imageUrl: result.imageUrl }),
      })
      if (!resp.ok) throw new Error('Upscale API error')
      const data = await resp.json()
      toast.success(data.message || 'Upscale solicitado')
    } catch (e) {
      console.error(e)
      toast.error('Error al solicitar upscale')
    }
  }

  const handleVariation = async (id: number | string) => {
    const result = results.find((r) => String(r.id) === String(id))
    if (!result?.imageUrl) return toast.error('Imagen no disponible para variation')
    toast.loading('Solicitando variation...')
    try {
      const resp = await fetch('/api/v1/variation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, imageUrl: result.imageUrl }),
      })
      if (!resp.ok) throw new Error('Variation API error')
      const data = await resp.json()
      toast.success(data.message || 'Variation solicitado')
    } catch (e) {
      console.error(e)
      toast.error('Error al solicitar variation')
    }
  }

  const handleReroll = async (id: number | string) => {
    const result = results.find((r) => String(r.id) === String(id))
    if (!result) return toast.error('Resultado no encontrado para re-roll')
    toast.loading('Re-rolling...')
    try {
      const resp = await fetch('/api/v1/reroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, prompt: result.prompt }),
      })
      if (!resp.ok) throw new Error('Reroll API error')
      const data = await resp.json()
      toast.success(data.message || 'Re-roll solicitado')
      // Optionally push a placeholder new result
      // setResults(prev => [{ id: Date.now(), prompt: result.prompt, isLoading: true, progress: 0}, ...prev])
    } catch (e) {
      console.error(e)
      toast.error('Error al solicitar re-roll')
    }
  }

  return (
    <div className='p-8'>
      <h2 className='text-3xl font-bold mb-2'>
        Generador de Publicidad para el Metaverso
      </h2>
      <p className='text-secondary-text mb-8'>
        Usa un prompt o inspírate en la galería para crear tu próxima gran
        campaña.
      </p>

      <div className='mt-8'>
        <PromptBarV2
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      <div className='mt-12'>
        <div className='flex gap-4 border-b border-surface-dark mb-6'>
          <TabButton
            label='Galería de Inspiración'
            active={activeTab === 'inspiracion'}
            onClick={() => setActiveTab('inspiracion')}
          />
          <TabButton
            label='Mis Generaciones'
            active={activeTab === 'generaciones'}
            onClick={() => setActiveTab('generaciones')}
          />
        </div>

        {activeTab === 'inspiracion' && (
          <div>
            {isLoading ? (
              <div>Cargando inspiración...</div>
            ) : (
              <InspirationCarousel
                onPromptClick={handlePromptClick}
                examples={inspirationData}
              />
            )}
            <SceneSelector onSceneSelect={handleSceneSelect} />
          </div>
        )}
        {activeTab === 'generaciones' && (
          <div>
            {/* Barra de acciones rápidas sobre el resultado seleccionado */}
            <div className='flex items-center gap-3 mb-4'>
              <div className='text-sm text-secondary-text mr-4'>
                {selectedResultId ? `Seleccionado: ${selectedResultId}` : 'Ningún resultado seleccionado'}
              </div>

              <button
                className={`px-3 py-1 rounded ${selectedResultId ? 'bg-accent-purple/90 text-white' : 'bg-surface-dark text-secondary-text cursor-not-allowed'}`}
                onClick={() => {
                  if (!selectedResultId) return
                  console.log('Upscale', selectedResultId)
                }}
                disabled={!selectedResultId}
              >
                U
              </button>

              <button
                className={`px-3 py-1 rounded ${selectedResultId ? 'bg-accent-green/90 text-white' : 'bg-surface-dark text-secondary-text cursor-not-allowed'}`}
                onClick={() => {
                  if (!selectedResultId) return
                  console.log('Variation', selectedResultId)
                }}
                disabled={!selectedResultId}
              >
                V
              </button>

              <button
                className={`px-3 py-1 rounded ${selectedResultId ? 'bg-accent-blue/90 text-white' : 'bg-surface-dark text-secondary-text cursor-not-allowed'}`}
                onClick={() => {
                  if (!selectedResultId) return
                  console.log('Re-roll', selectedResultId)
                }}
                disabled={!selectedResultId}
              >
                Re-roll
              </button>
            </div>

            <GenerationGrid
              results={results}
              isGenerating={isGenerating}
              onVisualize={(payload: { sceneId?: string; imageUrl?: string }) => {
                setViewState({ view: 'visualization', payload })
              }}
              selectedResultId={selectedResultId}
              onSelect={(id: number | string) => setSelectedResultId(Number(id))}
              onUpscale={handleUpscale}
              onVariation={handleVariation}
              onReroll={handleReroll}
            />
          </div>
        )}
      </div>

      {/* Render condicional para VisualizationStage */}
      {viewState.view === 'visualization' && (
        <div className='fixed inset-0 z-50 bg-black/90'>
          {/* payload cast a tipo conocido */}
          {(() => {
            const p = viewState.payload as {
              sceneId?: string
              imageUrl?: string
            } | null
            return (
              <VisualizationStage
                sceneId={p?.sceneId}
                onClose={() =>
                  setViewState({ view: 'creation', payload: null })
                }
              />
            )
          })()}
        </div>
      )}
    </div>
  )
}
