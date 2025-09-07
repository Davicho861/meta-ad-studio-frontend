import React, { useRef } from 'react'

type Props = {
  title?: string
  thumbnail?: string
  video?: string
}

export default function ResultCardMid({
  title = 'Untitled',
  thumbnail,
  video,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      const p = videoRef.current.play()
      if (p && typeof p.then === 'function') p.catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause()
      } catch (e) {
        /* ignore */
      }
    }
  }

  return (
    <article
      className='rounded-lg overflow-hidden bg-gray-900 text-white shadow-lg transform transition-transform duration-200 hover:scale-[1.02] focus-within:scale-[1.02]'
      tabIndex={0}
      aria-label={title}
    >
      <div
        className='relative w-full h-56 bg-black'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {video ? (
          <video
            ref={videoRef}
            className='w-full h-full object-cover'
            src={video}
            loop
            muted
            playsInline
            preload='metadata'
          />
        ) : (
          <img
            src={thumbnail || '/placeholder.png'}
            alt={title}
            className='w-full h-full object-cover'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none' />
        <div className='absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm'>
          {title}
        </div>
      </div>
      <div className='p-3 flex items-center justify-between'>
        <div className='text-sm text-gray-300'>
          by <strong className='text-white'>AI</strong>
        </div>
        <div className='flex gap-2'>
          <button
            aria-label='like'
            className='text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10'
          >
            ♡
          </button>
          <button
            aria-label='more'
            className='text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10'
          >
            ⋯
          </button>
        </div>
      </div>
    </article>
  )
}
