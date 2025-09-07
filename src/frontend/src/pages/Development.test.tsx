import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Development from './Development';

describe('Development Page', () => {
  it('renders the main heading', () => {
    render(<Development />);
    expect(screen.getByText('Desarrollo')).toBeInTheDocument();
  });
});
