/// <reference types="vitest" />
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock ResizeObserver
const ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

window.ResizeObserver = ResizeObserver;

// Mock PrismaClient from @prisma/client for client-side tests
vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {}
  },
}));
