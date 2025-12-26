import type { StorybookConfig } from '@storybook/nextjs';
import { resolve } from 'node:path';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/**/*.stories.mdx',
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: resolve(__dirname, '../../next.config.js'),
    },
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, { configType }) => {
    if (!config.resolve) {
      return config;
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    return config;
  },
};
export default config;
