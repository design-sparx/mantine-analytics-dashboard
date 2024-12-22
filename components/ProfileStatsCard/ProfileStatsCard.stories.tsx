import { IconUserDollar } from '@tabler/icons-react';

import ProfileStatsCard from './ProfileStatsCard';

import type { StoryObj } from '@storybook/react';


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Profile/Stats',
  component: ProfileStatsCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileStatsCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    amount: 1028192,
    title: 'Revenue',
    icon: IconUserDollar,
    color: 'green',
    progressValue: 67,
    asCurrency: true,
    style: {
      width: 200,
    },
  },
};
