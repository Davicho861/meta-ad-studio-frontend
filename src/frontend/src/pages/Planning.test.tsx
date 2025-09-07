import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Planning from './Planning.tsx';
import React from 'react';

// The recharts mock is now handled globally by Jest in __mocks__

describe('Planning Page', () => {
  it('renders the main heading', () => {
    render(
      <div style={{ width: '800px', height: '600px' }}>
        <Planning />
      </div>
    );
    expect(screen.getByText('Planeación')).toBeInTheDocument();
  });
});
