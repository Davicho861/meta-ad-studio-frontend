import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

// Use relaxed typing for Storybook stories to avoid strict generic inference issues in this repo
const meta: Meta<any> = {
  title: 'UI/Button',
  // cast to any to avoid strict component type mismatch in this repo's Storybook typings
  component: (Button as unknown) as any,
}

export default meta
type Story = StoryObj<any>

export const Primary: Story = {
  args: {
    children: 'Primary Button'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}
