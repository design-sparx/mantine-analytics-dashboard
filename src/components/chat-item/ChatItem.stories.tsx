import ChatItem from './ChatItem';

import type { StoryObj } from '@storybook/react';

const MOCKS = {
  id: '50d72d75-93b2-4c38-9d48-53a8292bf4bc',
  first_name: 'Ilario',
  last_name: 'Baldocci',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  sent_time: '7/6/2023',
  message:
    'Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.',
  sender: false,
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Chats/Item',
  component: ChatItem,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChatItem>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    loading: false,
    fullName: MOCKS.first_name + MOCKS.last_name,
    ...MOCKS,
  },
};

export const IsSender: Story = {
  args: {
    loading: false,
    fullName: 'you',
    ...MOCKS,
  },
};
