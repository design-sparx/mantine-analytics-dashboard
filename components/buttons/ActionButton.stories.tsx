import ActionButton from './ActionButton';

import type { StoryObj } from '@storybook/react';


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Mantine/Buttons/ActionButton',
  component: ActionButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: [
        'filled',
        'outline',
        'subtle',
        'transparent',
        'white',
        'light',
        'gradient',
        'default',
      ],
      control: { type: 'select' },
    },
    size: {
      options: ['xl', 'lg', 'md', 'sm', 'xs'],
      control: { type: 'inline-radio' },
    },
    radius: {
      options: ['xl', 'lg', 'md', 'sm', 'xs'],
      control: { type: 'inline-radio' },
    },
    disabled: {
      options: [true, false],
      control: { type: 'inline-radio' },
    },
    loading: {
      options: [true, false],
      control: { type: 'inline-radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    variant: 'filled',
  },
};

export const GradientVariant: Story = {
  args: {
    variant: 'gradient',
    gradient: { from: 'violet', to: 'indigo', deg: 90 },
    children: 'Gradient button',
  },
};

export const CustomIconSize: Story = {
  args: {
    iconSize: 24,
    size: 'xl',
  },
};
