import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { useIsMobile } from './use-mobile.tsx';

describe('useIsMobile', () => {
  let resizeListener: (() => void) | null = null;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn().mockImplementation((event, listener) => {
          if (event === 'change') {
            resizeListener = listener;
          }
        }),
        removeEventListener: vi.fn().mockImplementation((event, listener) => {
          if (event === 'change' && resizeListener === listener) {
            resizeListener = null;
          }
        }),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should return false for desktop size', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(false);
  });

  it('should return true for mobile size', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(true);
  });

  it('should update from false to true on window resize', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Act
    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
      // Trigger the captured listener
      if (resizeListener) {
        resizeListener();
      }
    });

    // Assert
    expect(result.current).toBe(true);
  });
});
