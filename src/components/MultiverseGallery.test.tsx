import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

    await waitFor(() => {
      expect(screen.getByText('Multiverse Video Gallery')).toBeInTheDocument();
    });

    expect(screen.getByText('Video 1')).toBeInTheDocument();
    expect(screen.getByText('Video 2')).toBeInTheDocument();

    // Check for the video elements using data-testid
    const videoElements = screen.getAllByTestId('video-element');
    expect(videoElements).toHaveLength(2);
    expect(videoElements[0]).toHaveAttribute('src', '/vid/video1.mp4');
    expect(videoElements[1]).toHaveAttribute('src', '/vid/video2.mp4');
  });

  it('renders error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<MultiverseGallery />);

    await waitFor(() => {
      expect(screen.getByText(`Error loading gallery: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('renders "No videos found" message when the gallery is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<MultiverseGallery />);

    await waitFor(() => {
      expect(screen.getByText('No videos found in the gallery.')).toBeInTheDocument();
    });
  });
});