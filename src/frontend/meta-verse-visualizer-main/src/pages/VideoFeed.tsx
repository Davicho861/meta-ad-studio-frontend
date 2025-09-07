import React, { useCallback, useEffect, useRef, useState } from 'react'
import FilterSidebar from '../components/FilterSidebar'
import VideoCard, { VideoResult } from '../components/VideoCard'
import VideoDetailModal from '../components/VideoDetailModal'

const PAGE_SIZE = 12

// Mock fetch function - replace with real API call
async function fetchVideos(
  offset: number,
  limit: number,
  filter: string
): Promise<VideoResult[]> {
  // Simulate network
  await new Promise((r) => setTimeout(r, 400))
  const items: VideoResult[] = Array.from({ length: limit }).map((_, i) => {
    const id = `vid-${offset + i}`
    return {
      id,
      prompt: `Sample prompt for video ${id} — imaginative scene with depth and lighting`,
      videoUrl: '', // empty on purpose to simulate not-yet-animated
      thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(id)}/600/1067`,
      author: { name: `User ${offset + i}`, avatarUrl: '' },
      likes: Math.floor(Math.random() * 1000),
    }
  })
  return items
}

const VideoFeed: React.FC = () => {
  const [filter, setFilter] = useState<'top' | 'hot' | 'new' | 'rising'>('top')
  const [items, setItems] = useState<VideoResult[]>([])
  const [selected, setSelected] = useState<VideoResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const page = useRef(0)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const next = await fetchVideos(page.current * PAGE_SIZE, PAGE_SIZE, filter)
    setItems((s) => [...s, ...next])
    page.current += 1
    if (next.length < PAGE_SIZE) setHasMore(false)
    setLoading(false)
  }, [filter, hasMore, loading])

  useEffect(() => {
    // reset when filter changes
    setItems([])
    page.current = 0
    setHasMore(true)
    loadMore()
  }, [filter, loadMore])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '400px' }
    )
    if (sentinelRef.current) obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [loadMore])

  return (
    <div className='flex h-full'>
      <FilterSidebar active={filter} onChange={(k) => setFilter(k)} />

      <main className='flex-1 p-6 overflow-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {items.map((it) => (
            <VideoCard
              key={it.id}
              result={it}
              onClick={(r) => setSelected(r)}
            />
          ))}
        </div>

        <div ref={sentinelRef} className='h-8' />

        {loading && (
          <p className='text-center text-secondary-text mt-4'>
            Cargando más...
          </p>
        )}
        {!hasMore && (
          <p className='text-center text-secondary-text mt-4'>
            No hay más resultados
          </p>
        )}
        <VideoDetailModal
          open={!!selected}
          onClose={() => setSelected(null)}
          videoUrl={selected?.videoUrl}
          thumbnailUrl={selected?.thumbnailUrl}
          prompt={selected?.prompt}
          author={selected?.author}
        />
      </main>
    </div>
  )
}

export default VideoFeed
