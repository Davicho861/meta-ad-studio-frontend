import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { server } from './src/mocks/server.js';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock for Recharts ResponsiveContainer
// vi.mock('recharts', async () => {
//   const OriginalModule = await vi.importActual('recharts');
//   return {
//     ...OriginalModule,
//     ResponsiveContainer: ({ children }) => {
//       return React.createElement('div', { className: 'recharts-responsive-container', style: { width: 800, height: 600 } }, children);
//     },
//   };
// });
