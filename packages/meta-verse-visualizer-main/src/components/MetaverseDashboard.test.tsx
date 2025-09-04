import React from 'react'
import { render, screen } from '@testing-library/react'
import { MetaverseDashboard } from './MetaverseDashboard'
import { describe, it, expect } from 'vitest'

describe('MetaverseDashboard', () => {
  it('renders the dashboard', () => {
    render(<MetaverseDashboard />)
    expect(
      screen.getByText('Generate Enterprise Metaverse Advertising Overlay')
    ).toBeInTheDocument()
  })
})
