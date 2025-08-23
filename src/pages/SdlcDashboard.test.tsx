import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SdlcDashboard from './SdlcDashboard';

describe('SdlcDashboard Page', () => {
  it('renders the main heading', () => {
    render(<SdlcDashboard />);
    expect(screen.getByText('Meta Ad Studio SDLC Nexus')).toBeInTheDocument();
  });
});
