import React, { useState, useEffect, useRef } from 'react'
import { Download, RotateCcw, Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useJobPolling from '../hooks/useJobPolling'

interface ResultCardProps {
  result: {
    imageUrl?: string
    prompt: string
    isLoading: boolean
    progress: number
    // optional id to reference the result on server
    id?: string
  }
  onVisualize?: (payload: { sceneId?: string; imageUrl?: string }) => void
}

export const ResultCardV2 = ({ result, onVisualize }: ResultCardProps) => {
  const [animating, setAnimating] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const jobState = useJobPolling(jobId)
  const prevStatusRef = useRef<string | null>(null)

  useEffect(() => {
    // Show a success toast the first time the job transitions to completed
    if (
      jobState.status === 'completed' &&
      prevStatusRef.current !== 'completed'
    ) {
      toast.success('¡Tu video está listo! Haz clic para verlo en detalle.')
    }
    prevStatusRef.current = jobState.status
  }, [jobState.status])

  const animateToVideo = async () => {
    if (!result.imageUrl || animating) return
    setAnimating(true)
    try {
      // Llamada a endpoint backend - aquí se asume POST /api/v1/animate-image
      // Payload: { imageUrl, prompt, id }
      // Respuesta esperada: { jobId } o { videoUrl, thumbnailUrl }
      const resp = await fetch('/api/v1/animate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: result.imageUrl,
          prompt: result.prompt,
          id: result.id,
        }),
      })

      if (!resp.ok) throw new Error('API error')

      // Si la API es asíncrona, podría devolver un jobId; aquí manejamos ambos casos.
      const data = await resp.json()
      if (data.videoUrl) {
        /* CODemod: console.log('Video ready', data)
       */} else if (data.jobId) {
        /* CODemod: console.log('Video job queued', data.jobId)
         */setJobId(data.jobId)
      }
    } catch (e) {
      /* CODemod: console.error('Failed to animate', e)
     */} finally {
      setAnimating(false)
    }
  }

  if (result.isLoading) {
    return (
      <div className='relative rounded-lg aspect-square bg-surface-dark flex flex-col items-center justify-center text-center p-4 animate-pulse'>
        <div className='w-full h-full bg-gray-700/50 absolute inset-0 filter blur-md'></div>
        <p className='text-sm text-secondary-text z-10'>
          {result.prompt.substring(0, 40)}...
        </p>
        <div className='w-full bg-gray-600 rounded-full h-2.5 mt-4 z-10'>
          <div
            className='bg-accent-blue h-2.5 rounded-full'
            style={{ width: `${result.progress}%` }}
          ></div>
        </div>
        <p className='text-accent-blue font-mono mt-2 z-10'>
          {result.progress}%
        </p>
      </div>
    )
  }
  // If job completed, show thumbnail+play overlay
  const isJobProcessing =
    jobState.status === 'processing' || jobState.status === 'queued'
  const isJobCompleted = jobState.status === 'completed'

  return (
    <div className='group relative rounded-lg overflow-hidden aspect-square'>
      <img
        src={isJobCompleted ? jobState.data!.thumbnailUrl : result.imageUrl}
        alt={result.prompt}
        className='w-full h-full object-cover'
      />
      {/* Overlay que aparece al hacer hover */}
      <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4'>
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-sm text-secondary-text text-center line-clamp-3'>
            {result.prompt}
          </p>
        </div>

        <div className='flex gap-2 justify-center'>
          <button className='p-2 bg-accent-purple/80 hover:bg-accent-purple text-white rounded-lg transition-colors'>
            <Wand2 className='w-4 h-4' />
          </button>
          <button
            className='p-2 bg-accent-green/80 hover:bg-accent-green text-white rounded-lg transition-colors'
            onClick={() => {
              // Llamar al handler si está disponible
              onVisualize?.({
                sceneId: 'times-square',
                imageUrl: result.imageUrl,
              })
            }}
            title='Visualizar en Escenario 3D'
          >
            {/* Icono simple: usar Wand2 como placeholder o reemplazar por otro */}
            <svg
              className='w-4 h-4'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path
                d='M12 2v4'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M5 9l14-4'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
          <button className='p-2 bg-accent-blue/80 hover:bg-accent-blue text-white rounded-lg transition-colors'>
            <RotateCcw className='w-4 h-4' />
          </button>
          <button className='p-2 bg-secondary-text/80 hover:bg-secondary-text text-white rounded-lg transition-colors'>
            <Download className='w-4 h-4' />
          </button>

          <button
            className='p-2 bg-yellow-600/90 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2'
            onClick={animateToVideo}
            title='Animar a Video'
          >
            {animating || isJobProcessing ? (
              <svg className='w-4 h-4 animate-spin' viewBox='0 0 24 24' />
            ) : isJobCompleted ? (
              '▶️'
            ) : (
              '🎬'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
