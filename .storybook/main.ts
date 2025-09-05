import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  // Temporarily disable addons to avoid preset loading conflicts in monorepo
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
}

export default config;
