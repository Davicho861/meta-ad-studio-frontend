import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginForm from './LoginForm.tsx';

// Mock the useAuth hook
vi.mock('../hooks/useAuth.tsx', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  it('should render the form elements', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should allow typing in the input fields', async () => {
    render(<LoginForm />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password');

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password');
  });
});
