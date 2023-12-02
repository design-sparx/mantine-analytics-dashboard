import type { StoryObj } from '@storybook/react';

import PageHeader from './PageHeader';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Page Header',
  component: PageHeader,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    title: 'Dashboard',
    withActions: true,
    style: { width: 800 },
  },
};

export const InvoiceActions: Story = {
  args: {
    title: 'Dashboard',
    invoiceAction: true,
    style: { width: 800 },
  },
};
