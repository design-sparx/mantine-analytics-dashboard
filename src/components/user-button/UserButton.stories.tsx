import MOCKS from '@public/mocks/UserProfile.json';

import UserButton from './UserButton';

import type { StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'User/Buttons',
  component: UserButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserButton>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    ...MOCKS,
    image: MOCKS.avatar,
  },
};

export const WithIcon: Story = {
  args: {
    ...MOCKS,
    image: MOCKS.avatar,
    icon: true,
    asAction: true,
  },
};
