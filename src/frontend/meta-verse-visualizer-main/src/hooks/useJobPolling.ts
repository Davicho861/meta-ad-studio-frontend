import { useEffect, useRef, useState } from 'react'

type JobState =
  | { status: 'idle' | 'queued' | 'processing'; data: null; error: null }
  | {
      status: 'completed'
      data: { videoUrl: string; thumbnailUrl: string }
      error: null
    }
  | { status: 'error'; data: null; error: string }

export default function useJobPolling(jobId?: string | null) {
  const [state, setState] = useState<JobState>({
    status: 'idle',
    data: null,
    error: null,
  })
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!jobId) return

    let mounted = true
    const check = async () => {
      try {
        const resp = await fetch(`/api/v1/animate-image/status/${jobId}`)
        if (!mounted) return
        if (resp.status === 404) {
          setState({ status: 'error', data: null, error: 'job_not_found' })
          return
        }
        const data = await resp.json()
        if (data.status === 'processing' || data.status === 'queued') {
          setState({ status: 'processing', data: null, error: null })
        } else if (data.status === 'completed') {
          setState({
            status: 'completed',
            data: { videoUrl: data.videoUrl, thumbnailUrl: data.thumbnailUrl },
            error: null,
          })
          // stop polling
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        } else {
          setState({ status: 'error', data: null, error: 'unknown_status' })
        }
      } catch (e: unknown) {
         
        const msg =
          e &&
          typeof e === 'object' &&
          'message' in e &&
          typeof (e as any).message === 'string'
            ? (e as any).message
            : 'network_error'
        setState({ status: 'error', data: null, error: msg })
      }
    }

    // initial check immediately
    check()
    intervalRef.current = window.setInterval(check, 2000)

    return () => {
      mounted = false
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [jobId])

  return state
}
