import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MultiverseGallery from './MultiverseGallery.js';
import '@testing-library/jest-dom';
import { server } from '../mocks/server.js';
import { http, HttpResponse } from 'msw';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

describe('MultiverseGallery Component', () => {
  it('renders loading state initially and then the content', async () => {
    render(<MultiverseGallery />);
    
    expect(screen.getByText('Loading gallery...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading gallery...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('First Glimpse of the Zetaverse')).toBeInTheDocument();
  });

  it('renders videos when fetch is successful', async () => {
    render(<MultiverseGallery />);

    await waitFor(() => {
      expect(screen.getByText('First Glimpse of the Zetaverse')).toBeInTheDocument();
    });

    expect(screen.getByText('Cybernetic Dreams')).toBeInTheDocument();
    expect(screen.getByText('Ad-World Prime')).toBeInTheDocument();
    expect(screen.getByText('Neon-Lit Nexus')).toBeInTheDocument();

    const videoElements = screen.getAllByTestId('video-element');
    expect(videoElements).toHaveLength(4);
  });

  it('renders error message when fetch fails', async () => {
    server.use(
      http.get('/api/multiverse/videos', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<MultiverseGallery />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading gallery/)).toBeInTheDocument();
    });
  });

  it('renders "No videos found" message when the gallery is empty', async () => {
    server.use(
      http.get('/api/multiverse/videos', () => {
        return HttpResponse.json([]);
      })
    );

    render(<MultiverseGallery />);

    await waitFor(() => {
      expect(screen.getByText('No videos found in the gallery.')).toBeInTheDocument();
    });
  });
});
