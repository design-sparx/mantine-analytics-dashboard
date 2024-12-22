import PricingCard from './PricingCard';

import type { StoryObj } from '@storybook/react';


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Pricing/Card',
  component: PricingCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    tier: 'basic',
    price: {
      month: 0,
      year: 0,
    },
    features: ['Rich landing pages', '100+ components'],
    preferred: false,
    actionText: 'start for free',
    description: 'All the basics for starting a new business',
  },
};

export const Preferred: Story = {
  args: {
    tier: 'standard',
    price: {
      month: 25,
      year: 45,
    },
    features: [
      'Rich landing pages',
      '100+ components',
      'Flexible licensing',
      'Speedy build tooling',
      '6 months free support',
    ],
    preferred: true,
    actionText: 'start with standard',
    description: 'Everything you need for a growing business',
  },
};
