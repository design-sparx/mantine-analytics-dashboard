import ChatsList from './ChatsList';

import type { StoryObj } from '@storybook/react';


const MOCKS = {
  id: '53ba415c-c210-4aa2-9b46-c6e5eb1075dc',
  first_name: 'Sher',
  last_name: 'Bleackley',
  email: 'sbleackley1@rediff.com',
  avatar:
    'https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  sent_time: '1/4/2023',
  last_message:
    'In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Chats/List',
  component: ChatsList,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    lastMessage: MOCKS.last_message,
    firstName: MOCKS.first_name,
    lastName: MOCKS.last_name,
    avatar: MOCKS.avatar,
  },
};
