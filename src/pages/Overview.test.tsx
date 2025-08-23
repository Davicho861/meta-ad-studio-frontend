import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Overview from './Overview';

describe('Overview Page', () => {
  it('renders the main heading', () => {
    render(<Overview />);
    expect(screen.getByText('Visión General')).toBeInTheDocument();
  });
});
