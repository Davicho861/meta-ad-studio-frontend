import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from './Settings';

describe('Settings Page', () => {
  it('renders the main heading', () => {
    render(<Settings />);
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });
});
