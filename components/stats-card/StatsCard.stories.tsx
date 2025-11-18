import StatsCard from './StatsCard';

import type { StoryObj } from '@storybook/react';


const MOCKS = {
  title: 'Sales Today',
  value: '13,456',
  diff: 34,
  period: 'today',
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Stats/Card',
  component: StatsCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatsCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    data: MOCKS,
    style: { width: 240 },
  },
};
