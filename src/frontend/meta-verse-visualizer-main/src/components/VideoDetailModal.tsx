import React from 'react'

interface VideoDetailModalProps {
  open: boolean
  onClose: () => void
  videoUrl?: string
  thumbnailUrl?: string
  prompt?: string
  author?: { name?: string; avatarUrl?: string }
  date?: string
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  open,
  onClose,
  videoUrl,
  thumbnailUrl,
  prompt,
  author,
  date,
}) => {
  if (!open) return null

  const copyPrompt = async () => {
    if (!prompt) return
    try {
      await navigator.clipboard.writeText(prompt)
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-6'>
      <div className='absolute inset-0 bg-black/70' onClick={onClose} />

      <div className='relative bg-surface-dark rounded-xl max-w-4xl w-full mx-auto overflow-hidden'>
        <button
          className='absolute right-3 top-3 text-white bg-black/50 rounded-full p-2'
          onClick={onClose}
          aria-label='Cerrar'
        >
          ✕
        </button>

        <div className='flex flex-col md:flex-row'>
          <div className='flex-1 bg-black flex items-center justify-center'>
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                poster={thumbnailUrl}
                className='w-full h-full max-h-[70vh] object-contain'
              />
            ) : (
              <img
                src={thumbnailUrl}
                alt={prompt}
                className='w-full h-full object-contain max-h-[70vh]'
              />
            )}
          </div>

          <div className='w-full md:w-96 p-4 flex flex-col gap-3'>
            <h3 className='text-lg font-semibold'>Detalles del video</h3>

            <div className='flex items-center gap-3'>
              {author?.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  className='w-10 h-10 rounded-full'
                  alt={author.name}
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-gray-600' />
              )}
              <div>
                <p className='text-sm text-secondary-text'>
                  {author?.name ?? 'Autor desconocido'}
                </p>
                <p className='text-xs text-secondary-text'>
                  {date ?? new Date().toLocaleString()}
                </p>
              </div>
            </div>

            <div className='flex-1 overflow-auto'>
              <p className='text-sm text-secondary-text whitespace-pre-wrap'>
                {prompt}
              </p>
            </div>

            <div className='flex gap-2'>
              <button
                className='flex-1 py-2 px-3 bg-accent-blue text-white rounded-lg'
                onClick={copyPrompt}
              >
                Copiar Prompt
              </button>
              <button
                className='py-2 px-3 bg-secondary-text text-white rounded-lg'
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoDetailModal
