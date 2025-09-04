import React from 'react'

interface InspirationItem {
  id: number
  title: string
  location: string
  imageUrl: string
  prompt: string
}

interface InspirationCardProps {
  item: InspirationItem
  onPromptClick: (prompt: string) => void
}

export const InspirationCard = ({
  item,
  onPromptClick,
}: InspirationCardProps) => (
  <div
    onClick={() => onPromptClick(item.prompt)}
    role='button'
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onPromptClick(item.prompt)
      }
    }}
    className='flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden relative group cursor-pointer transform hover:-translate-y-1 transition-transform duration-300'
  >
    <img
      src={item.imageUrl}
      className='w-full h-full object-cover'
      alt={item.title}
    />
    <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex flex-col justify-end'>
      <h4 className='text-white font-bold text-sm'>{item.title}</h4>
      <p className='text-xs text-secondary-text'>{item.location}</p>
    </div>
  </div>
)
