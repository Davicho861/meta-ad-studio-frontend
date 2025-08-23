import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppBar } from '../AppBar';

describe('AppBar', () => {
  it('renders the AppBar component', () => {
    render(
      <MemoryRouter>
        <AppBar username="testuser" />
      </MemoryRouter>
    );
    expect(screen.getByText('Meta Studio Flow')).toBeInTheDocument();
  });
});
