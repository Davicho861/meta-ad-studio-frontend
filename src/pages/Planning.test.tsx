import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Planning from './Planning';

describe('Planning Page', () => {
  it('renders the main heading', () => {
    render(<Planning />);
    expect(screen.getByText('Planeación')).toBeInTheDocument();
  });
});
