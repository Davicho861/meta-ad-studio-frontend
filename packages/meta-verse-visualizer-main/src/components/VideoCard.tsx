import React, { useRef, useState } from 'react'

export interface VideoResult {
  id: string
  prompt: string
  videoUrl?: string
  thumbnailUrl: string
  author?: {
    name?: string
    avatarUrl?: string
  }
  likes?: number
}

interface VideoCardProps {
  result: VideoResult
  onClick?: (result: VideoResult) => void
}

export const VideoCard: React.FC<VideoCardProps> = ({ result, onClick }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => {
    setIsHovering(true)
    try {
      videoRef.current?.play()
    } catch (e) {
      // ignore play errors (autoplay policies)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    try {
      videoRef.current?.pause()
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <div
      className='relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer bg-surface-dark group'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick?.(result)}
    >
      {result.videoUrl ? (
        <video
          ref={videoRef}
          src={result.videoUrl}
          poster={result.thumbnailUrl}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
          playsInline
          loop
          muted
        />
      ) : null}

      <img
        src={result.thumbnailUrl}
        alt={result.prompt}
        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
          isHovering ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity'>
        <div className='flex items-center gap-2'>
          {result.author?.avatarUrl ? (
            <img
              src={result.author.avatarUrl}
              className='w-7 h-7 rounded-full'
              alt={result.author.name}
            />
          ) : (
            <div className='w-7 h-7 rounded-full bg-gray-600' />
          )}
          <div className='flex-1'>
            <p className='text-xs text-secondary-text line-clamp-1'>
              {result.author?.name ?? 'Unknown'}
            </p>
            <p className='text-sm text-white font-medium line-clamp-2'>
              {result.prompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
