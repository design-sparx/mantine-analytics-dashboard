import { Id } from '@/types';

import KanbanCard from './KanbanCard';

import type { StoryObj } from '@storybook/react';


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Tasks/Kanban/Card',
  component: KanbanCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    task: {
      id: '1',
      columnId: 'todo',
      content: 'List admin APIs for dashboard',
      comments: 0,
    },
    deleteTask: (id: Id) => null,
    updateTask: (id: Id, content: string) => null,
  },
};
