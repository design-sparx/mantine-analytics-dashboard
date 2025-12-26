import ProjectsTable from './ProjectsTable';

import type { ProjectDto } from '@/types';
import type { StoryObj } from '@storybook/react';

// Mock data with proper types matching ProjectDto
// Status values: 0=Pending, 1=In Progress, 2=Completed, 3=On Hold, 4=Cancelled
const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'E-commerce Platform',
    startDate: '2023-01-15',
    dueDate: '2023-06-30',
    status: 2, // Completed
    completionPercentage: 100,
    statusText: 'Completed',
    owner: { userName: 'John Smith' } as any,
  },
  {
    id: '2',
    title: 'Mobile App Redesign',
    startDate: '2023-03-01',
    dueDate: '2023-08-15',
    status: 1, // In Progress
    completionPercentage: 60,
    statusText: 'In Progress',
    owner: { userName: 'Sarah Johnson' } as any,
  },
  {
    id: '3',
    title: 'API Migration',
    startDate: '2023-04-10',
    dueDate: '2023-07-20',
    status: 1, // In Progress
    completionPercentage: 45,
    statusText: 'In Progress',
    owner: { userName: 'Michael Chen' } as any,
  },
  {
    id: '4',
    title: 'Dashboard Analytics',
    startDate: '2023-02-20',
    dueDate: '2023-05-30',
    status: 2, // Completed
    completionPercentage: 100,
    statusText: 'Completed',
    owner: { userName: 'Emily Davis' } as any,
  },
  {
    id: '5',
    title: 'Security Audit',
    startDate: '2023-05-01',
    dueDate: '2023-09-30',
    status: 0, // Pending
    completionPercentage: 0,
    statusText: 'Pending',
    owner: { userName: 'David Wilson' } as any,
  },
  {
    id: '6',
    title: 'Cloud Infrastructure',
    startDate: '2023-01-05',
    dueDate: '2023-04-15',
    status: 4, // Cancelled
    completionPercentage: 25,
    statusText: 'Cancelled',
    owner: { userName: 'Lisa Brown' } as any,
  },
  {
    id: '7',
    title: 'Customer Portal',
    startDate: '2023-06-01',
    dueDate: '2023-11-30',
    status: 1, // In Progress
    completionPercentage: 70,
    statusText: 'In Progress',
    owner: { userName: 'Robert Martinez' } as any,
  },
  {
    id: '8',
    title: 'Payment Gateway',
    startDate: '2023-03-15',
    dueDate: '2023-07-31',
    status: 2, // Completed
    completionPercentage: 100,
    statusText: 'Completed',
    owner: { userName: 'Jennifer Lee' } as any,
  },
  {
    id: '9',
    title: 'Documentation System',
    startDate: '2023-04-01',
    dueDate: '2023-06-30',
    status: 0, // Pending
    completionPercentage: 0,
    statusText: 'Pending',
    owner: { userName: 'James Anderson' } as any,
  },
  {
    id: '10',
    title: 'Performance Optimization',
    startDate: '2023-05-15',
    dueDate: '2023-08-31',
    status: 1, // In Progress
    completionPercentage: 55,
    statusText: 'In Progress',
    owner: { userName: 'Amanda Taylor' } as any,
  },
] as ProjectDto[];

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Projects/Table',
  component: ProjectsTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProjectsTable>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    data: MOCK_PROJECTS as ProjectDto[],
    error: null,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    error: null,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    data: [],
    error: 'Error loading projects',
    loading: false,
  },
};
