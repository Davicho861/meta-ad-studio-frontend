import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Deployment from './Deployment';

describe('Deployment Page', () => {
  it('renders the main heading', () => {
    render(<Deployment />);
    expect(screen.getByText('Despliegue')).toBeInTheDocument();
  });
});
