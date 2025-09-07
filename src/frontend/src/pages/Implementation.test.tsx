import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Implementation from './Implementation';

describe('Implementation Page', () => {
  it('renders the main heading', () => {
    render(<Implementation />);
    expect(screen.getByText('Implementación')).toBeInTheDocument();
  });
});
