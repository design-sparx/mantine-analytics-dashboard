import { IconCalendarTime } from '@tabler/icons-react';

import DateTimeInput from './DateTimeField';

import type { StoryObj } from '@storybook/react';


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Mantine/Dates/DateTimeField',
  component: DateTimeInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['default', 'filled', 'unstyled'],
      control: { type: 'select' },
    },
    size: {
      options: ['xl', 'lg', 'md', 'sm', 'xs'],
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    w: 200,
  },
};

export const WithSeconds: Story = {
  args: {
    withSeconds: true,
    w: 200,
  },
};

export const ModalPicker: Story = {
  args: {
    dropdownType: 'modal',
    w: 200,
  },
};

export const WithIcon: Story = {
  args: {
    leftSection: <IconCalendarTime size={16} />,
    leftSectionPointerEvents: 'none',
    w: 200,
  },
};

export const Clearable: Story = {
  args: {
    clearable: true,
    w: 200,
  },
};
