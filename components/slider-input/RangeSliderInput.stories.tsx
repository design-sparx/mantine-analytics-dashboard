import RangeSliderInput from './RangeSliderInput';

import type { StoryObj } from '@storybook/react';


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Mantine/Input/RangeSlider',
  component: RangeSliderInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    w: 400,
  },
};

export const LabelVisible: Story = {
  args: {
    labelAlwaysOn: true,
    w: 400,
  },
};

export const Steps: Story = {
  args: {
    step: 20,
    w: 400,
  },
};

export const ThumbSize: Story = {
  args: {
    thumbSize: 24,
    defaultValue: [20, 60],
    w: 400,
  },
};

export const Inverted: Story = {
  args: {
    inverted: true,
    w: 400,
  },
};
