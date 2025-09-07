import React from 'react'
import { render, screen } from '@testing-library/react'
import { MetaverseDashboard } from './MetaverseDashboard'
import { describe, it, expect } from 'vitest'

describe('MetaverseDashboard', () => {
  it('renders the dashboard', () => {
    render(<MetaverseDashboard />)
    // Use a role-based selector for the main heading (more resilient)
    expect(
      screen.getByRole('heading', {
        name: /Generador de Publicidad para el Metaverso/i,
      })
    ).toBeInTheDocument()
  })
})
