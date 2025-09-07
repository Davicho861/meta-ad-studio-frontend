import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { GenerationGrid } from '../GenerationGrid'

const sampleResults = [
  { id: 1, imageUrl: '/img.jpg', prompt: 'prompt', isLoading: false, progress: 100 },
]

describe('GenerationGrid actions', () => {
  it('calls handlers when overlay buttons clicked', async () => {
    const onUpscale = vi.fn()
    const onVariation = vi.fn()
    const onReroll = vi.fn()
    const onSelect = vi.fn()

    render(
      <GenerationGrid
        results={sampleResults}
        onUpscale={onUpscale}
        onVariation={onVariation}
        onReroll={onReroll}
        onSelect={onSelect}
      />
    )

    const user = userEvent.setup()

  // There are duplicate buttons (in-card overlay + grid overlay). Select the grid overlay buttons (second set).
  const upscales = screen.getAllByTitle('Upscale (U)')
  const variations = screen.getAllByTitle('Variation (V)')
  const rerolls = screen.getAllByTitle('Re-roll')

  const upscale = upscales[1]
  const variation = variations[1]
  const reroll = rerolls[1]

  await user.click(upscale)
  await user.click(variation)
  await user.click(reroll)

  expect(onSelect).toHaveBeenCalledTimes(3)
  expect(onUpscale).toHaveBeenCalledWith(1)
  expect(onVariation).toHaveBeenCalledWith(1)
  expect(onReroll).toHaveBeenCalledWith(1)
  })
})
