import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Profile from './Profile.tsx';
import { useAuth } from '../hooks/useAuth.tsx';

// Mock the useAuth hook
vi.mock('../hooks/useAuth');

describe('Profile Component', () => {
  it('should display a loading indicator when isLoading is true', () => {
    // Arrange
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    // Act
    render(<Profile />);

    // Assert
    expect(screen.getByText('Por favor, inicie sesión.')).toBeInTheDocument();
  });

  it('should display a guest message and login button when not authenticated', () => {
    // Arrange
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    // Act
    render(<Profile />);

    // Assert
    expect(screen.getByText('Por favor, inicie sesión.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('should display a welcome message and logout button when authenticated', () => {
    // Arrange
    const mockUser = { username: 'Usuario de Prueba' };
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
    });

    // Act
    render(<Profile />);

    // Assert
    expect(screen.getByText(/Bienvenido, Usuario de Prueba/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar Sesión' })).toBeInTheDocument();
  });
});
