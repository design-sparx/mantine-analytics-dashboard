import ButtonsGroup from './ButtonsGroup';

import type { StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Mantine/Buttons/ButtonGroup',
  component: ButtonsGroup,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: [
        'default',
        'filled',
        'outline',
        'subtle',
        'transparent',
        'white',
        'light',
        'gradient',
      ],
      control: { type: 'select' },
    },
    size: {
      options: [
        'xl',
        'lg',
        'md',
        'sm',
        'xs',
        'compact-xl',
        'compact-lg',
        'compact-md',
        'compact-sm',
        'compact-xs',
      ],
      control: { type: 'select' },
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
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'inline-radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const VerticalOrientation: Story = {
  args: {
    orientation: 'vertical',
  },
};

export const CustomIconSize: Story = {
  args: {
    size: 'xl',
  },
};
