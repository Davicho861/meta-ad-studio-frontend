import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import VideoDetailModal from '../VideoDetailModal'

describe('VideoDetailModal', () => {
  it('renders prompt, author and buttons when open', () => {
    render(
      <VideoDetailModal
        open={true}
        onClose={() => {}}
        videoUrl='http://example.com/video.mp4'
        thumbnailUrl='http://example.com/thumb.jpg'
        prompt={'This is a test prompt'}
        author={{ name: 'Tester', avatarUrl: '' }}
        date={'2025-09-04'}
      />
    )

    expect(screen.getByText('Detalles del video')).toBeInTheDocument()
    expect(screen.getByText('This is a test prompt')).toBeInTheDocument()
    expect(screen.getByText('Tester')).toBeInTheDocument()
    expect(screen.getByText('2025-09-04')).toBeInTheDocument()
    expect(screen.getByText('Copiar Prompt')).toBeInTheDocument()
  })
})
