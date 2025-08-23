import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiverseGallery from './MultiverseGallery';

// Mock the fetch API
global.fetch = jest.fn();

describe('MultiverseGallery Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    render(<MultiverseGallery />);
    expect(screen.getByText('Loading gallery...')).toBeInTheDocument();
  });

  it('renders videos when fetch is successful', async () => {
    const mockVideos = [
      { id: '1', url: '/vid/video1.mp4', caption: 'Video 1' },
      { id: '2', url: '/vid/video2.mp4', caption: 'Video 2' },
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVideos,
    });

    render(<MultiverseGallery />);

    // findBy queries wait for the element to appear
    expect(await screen.findByText('Multiverse Video Gallery')).toBeInTheDocument();
    expect(await screen.findByText('Video 1')).toBeInTheDocument();
    expect(await screen.findByText('Video 2')).toBeInTheDocument();

    // Check for the video elements
    const videoElements = screen.getAllByRole('video');
    expect(videoElements).toHaveLength(2);
    expect(videoElements[0]).toHaveAttribute('src', '/vid/video1.mp4');
    expect(videoElements[1]).toHaveAttribute('src', '/vid/video2.mp4');
  });

  it('renders error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<MultiverseGallery />);

    expect(await screen.findByText(`Error loading gallery: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders "No videos found" message when the gallery is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<MultiverseGallery />);

    expect(await screen.findByText('No videos found in the gallery.')).toBeInTheDocument();
  });
});