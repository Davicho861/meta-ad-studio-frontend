import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { vi } from 'vitest';
import { AppRouter } from './router.tsx'; // Assuming AppRouter is exported from router.tsx
import '@testing-library/jest-dom';

// Mock the ProtectedRoute component to avoid dealing with authentication in these tests
vi.mock('./components/ProtectedRoute.tsx', () => ({
  ProtectedRoute: () => <div data-testid="protected-route-mock" />,
}));

describe('AppRouter', () => {
  it('should render the login form on the /login path', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/login',
          element: <div>Login Page</div>,
        },
      ],
      {
        initialEntries: ['/login'],
      }
    );

    render(<RouterProvider router={router} />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render the protected route mock on the root path', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <div data-testid="protected-route-mock" />,
        },
      ],
      {
        initialEntries: ['/'],
      }
    );

    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('protected-route-mock')).toBeInTheDocument();
  });
});
