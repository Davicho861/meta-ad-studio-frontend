import React, { useState, useEffect, useRef } from 'react'
import { Download, RotateCcw, Wand2 } from 'lucide-react'
import ActionIcon from './ui/ActionIcon'
import toast from 'react-hot-toast'
import useJobStream from '../hooks/useJobStream'

interface ResultCardProps {
  result: {
    imageUrl?: string
    prompt: string
    isLoading: boolean
    progress: number
    id?: string
  }
  onVisualize?: (payload: { sceneId?: string; imageUrl?: string }) => void
}

export const ResultCardV2: React.FC<ResultCardProps> = ({ result, onVisualize }) => {
  const [animating, setAnimating] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const jobState = useJobStream(jobId)
  const prevStatusRef = useRef<string | null>(null)

  useEffect(() => {
    if (jobState.status === 'completed' && prevStatusRef.current !== 'completed') {
      toast.success('¡Tu video está listo! Haz clic para verlo en detalle.')
    }
    prevStatusRef.current = jobState.status
  }, [jobState.status])

  const animateToVideo = async () => {
    if (!result.imageUrl || animating) return
    setAnimating(true)
    try {
      const resp = await fetch('/api/v1/animate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: result.imageUrl, prompt: result.prompt, id: result.id }),
      })

      if (!resp.ok) throw new Error('API error')
      const data = await resp.json()
      if (data.jobId) setJobId(data.jobId)
    } catch (e) {
      // swallow - non-critical for UI audit
    } finally {
      setAnimating(false)
    }
  }

  if (result.isLoading) {
    return (
      <div className='relative rounded-lg aspect-square bg-surface-dark flex flex-col items-center justify-center text-center p-4 animate-pulse motion-reduce:animate-none'>
        <div className='w-full h-full bg-gray-700/50 absolute inset-0 filter blur-md' />
        <p className='text-sm text-secondary-text z-10'>{result.prompt.substring(0, 40)}...</p>
        <div className='w-full bg-gray-600 rounded-full h-2.5 mt-4 z-10'>
          <div className='bg-accent-blue h-2.5 rounded-full' style={{ width: `${result.progress}%` }} />
        </div>
        <p className='text-accent-blue font-mono mt-2 z-10'>{result.progress}%</p>
      </div>
    )
  }

  const isJobProcessing = jobState.status === 'processing' || jobState.status === 'queued'
  const isJobCompleted = jobState.status === 'completed'

  return (
    <div tabIndex={0} className='group relative rounded-lg overflow-hidden aspect-square focus-within:ring-2 focus-within:ring-accent-blue/50'>
      <img src={isJobCompleted ? jobState.data?.thumbnailUrl ?? result.imageUrl : result.imageUrl} alt={result.prompt} className='w-full h-full object-cover' />

      <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none flex flex-col justify-between p-4 focus-within:opacity-100'>
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-sm text-secondary-text text-center line-clamp-3'>{result.prompt}</p>
        </div>

        <div className='flex gap-2 justify-center'>
          <ActionIcon label='Reintentar' className='p-2 bg-accent-purple/80 hover:bg-accent-purple text-white rounded-lg transition-colors'>
            <Wand2 className='w-4 h-4' />
          </ActionIcon>

          <ActionIcon
            label='Visualizar en Escenario 3D'
            className='p-2 bg-accent-green/80 hover:bg-accent-green text-white rounded-lg transition-colors'
            onClick={() => onVisualize?.({ sceneId: 'times-square', imageUrl: result.imageUrl })}
          >
            <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
              <path d='M12 2v4' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M5 9l14-4' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </ActionIcon>

          <ActionIcon label='Rotar' className='p-2 bg-accent-blue/80 hover:bg-accent-blue text-white rounded-lg transition-colors'>
            <RotateCcw className='w-4 h-4' />
          </ActionIcon>

          <ActionIcon label='Descargar' className='p-2 bg-secondary-text/80 hover:bg-secondary-text text-white rounded-lg transition-colors'>
            <Download className='w-4 h-4' />
          </ActionIcon>

          <ActionIcon label='Animar a Video' className='p-2 bg-yellow-600/90 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2' onClick={animateToVideo}>
            {animating || isJobProcessing ? <svg className='w-4 h-4 animate-spin' viewBox='0 0 24 24' /> : isJobCompleted ? '▶️' : '🎬'}
          </ActionIcon>
        </div>
      </div>
    </div>
  )
}
