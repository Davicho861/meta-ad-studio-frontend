import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Insights from './Insights';

describe('Insights Page', () => {
  it('renders the main heading', () => {
    render(<Insights />);
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });
});
