import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './useAuth.tsx';
import React from 'react';
import { vi } from 'vitest';

describe('useAuth', () => {
  it('should return the initial state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
  });

  it('should handle successful login', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({ username: 'testuser' });
    });

    expect(result.current.user).toEqual({ username: 'testuser' });
  });

  it('should handle logout', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({ username: 'testuser' });
    });

    expect(result.current.user).toEqual({ username: 'testuser' });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });

  it('should throw an error if used outside of AuthProvider', () => {
    // Suppress console.error for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
    consoleErrorSpy.mockRestore();
  });
});
