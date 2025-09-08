import { useEffect, useRef, useState } from 'react'

type JobState =
  | { status: 'idle' | 'queued' | 'processing'; data: null; error: null }
  | { status: 'completed'; data: { videoUrl?: string; thumbnailUrl?: string } | null; error: null }
  | { status: 'error'; data: null; error: string }

export default function useJobStream(jobId?: string | null) {
  const [state, setState] = useState<JobState>({ status: 'idle', data: null, error: null })
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!jobId) return

    let mounted = true

    const start = () => {
      try {
        const url = `/api/jobs/${jobId}/stream`
        const es = new EventSource(url)
        esRef.current = es

        es.addEventListener('status', (ev: MessageEvent) => {
          if (!mounted) return
          try {
            const payload = JSON.parse(ev.data)
            if (payload.status === 'processing' || payload.status === 'queued') {
              setState({ status: 'processing', data: null, error: null })
            } else if (payload.status === 'completed') {
              setState({ status: 'completed', data: { videoUrl: payload.videoUrl, thumbnailUrl: payload.thumbnailUrl }, error: null })
              es.close()
            } else if (payload.status === 'failed') {
              setState({ status: 'error', data: null, error: payload.error || 'failed' })
              es.close()
            }
          } catch (e) {
            // ignore parse errors
          }
        })

        es.onerror = () => {
          // try fallback reconnect after short delay
          es.close()
          if (!mounted) return
          setTimeout(() => start(), 2000)
        }
      } catch (e) {
        setState({ status: 'error', data: null, error: 'eventsource_error' })
      }
    }

    start()

    return () => {
      mounted = false
      if (esRef.current) {
        esRef.current.close()
        esRef.current = null
      }
    }
  }, [jobId])

  return state
}
