import ProjectsTable from './ProjectsTable';

import type { components } from '@/lib/api';
import type { StoryObj } from '@storybook/react';

type ProjectDto = components['schemas']['ProjectDto'];

// Mock data with proper types matching ProjectDto
// ProjectState values: 1=Pending, 2=In Progress, 3=Completed, 4=Cancelled
const MOCK_PROJECTS: ProjectDto[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    start_date: '2023-01-15',
    end_date: '2023-06-30',
    state: 3, // Completed
    assignee: 'John Smith',
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    start_date: '2023-03-01',
    end_date: '2023-08-15',
    state: 2, // In Progress
    assignee: 'Sarah Johnson',
  },
  {
    id: '3',
    name: 'API Migration',
    start_date: '2023-04-10',
    end_date: '2023-07-20',
    state: 2, // In Progress
    assignee: 'Michael Chen',
  },
  {
    id: '4',
    name: 'Dashboard Analytics',
    start_date: '2023-02-20',
    end_date: '2023-05-30',
    state: 3, // Completed
    assignee: 'Emily Davis',
  },
  {
    id: '5',
    name: 'Security Audit',
    start_date: '2023-05-01',
    end_date: '2023-09-30',
    state: 1, // Pending
    assignee: 'David Wilson',
  },
  {
    id: '6',
    name: 'Cloud Infrastructure',
    start_date: '2023-01-05',
    end_date: '2023-04-15',
    state: 4, // Cancelled
    assignee: 'Lisa Brown',
  },
  {
    id: '7',
    name: 'Customer Portal',
    start_date: '2023-06-01',
    end_date: '2023-11-30',
    state: 2, // In Progress
    assignee: 'Robert Martinez',
  },
  {
    id: '8',
    name: 'Payment Gateway',
    start_date: '2023-03-15',
    end_date: '2023-07-31',
    state: 3, // Completed
    assignee: 'Jennifer Lee',
  },
  {
    id: '9',
    name: 'Documentation System',
    start_date: '2023-04-01',
    end_date: '2023-06-30',
    state: 1, // Pending
    assignee: 'James Anderson',
  },
  {
    id: '10',
    name: 'Performance Optimization',
    start_date: '2023-05-15',
    end_date: '2023-08-31',
    state: 2, // In Progress
    assignee: 'Amanda Taylor',
  },
];

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
    data: MOCK_PROJECTS,
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
