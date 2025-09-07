import { http, HttpResponse } from 'msw';

export const handlers = [
  // Handler for the multiverse videos
  http.get('/api/multiverse/videos', () => {
    return HttpResponse.json([
      { id: '1', url: '/videos/zetaverse.mp4', caption: 'First Glimpse of the Zetaverse' },
      { id: '2', url: '/videos/cybernetic.mp4', caption: 'Cybernetic Dreams' },
      { id: '3', url: '/videos/ad-world.mp4', caption: 'Ad-World Prime' },
      { id: '4', url: '/videos/nexus.mp4', caption: 'Neon-Lit Nexus' },
    ]);
  }),

  // Handler for the integration test
  http.get('http://localhost:3001/api/data', () => {
    return HttpResponse.json({ message: 'Success', data: [1, 2, 3] });
  }),
];
