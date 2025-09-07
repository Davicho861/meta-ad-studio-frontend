import React from 'react'
import ResultCardMid from './ResultCardMid'

type Item = {
  id: string
  title?: string
  thumbnail?: string
  video?: string
}

function PlaceholderCard() {
  return (
    <div className='animate-pulse rounded-lg overflow-hidden bg-gray-800 h-56' />
  )
}

export default function ResultsGrid({ items = [] }: { items?: Item[] }) {
  const placeholders = new Array(6).fill(0)

  return (
    <div className='p-4'>
      <div className='columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4'>
        {items.length === 0
          ? placeholders.map((_, i) => (
              <div key={`ph-${i}`} className='break-inside-avoid'>
                <PlaceholderCard />
              </div>
            ))
          : items.map((it) => (
              <div key={it.id} className='break-inside-avoid'>
                <ResultCardMid
                  title={it.title}
                  thumbnail={it.thumbnail}
                  video={it.video}
                />
              </div>
            ))}
      </div>
    </div>
  )
}
