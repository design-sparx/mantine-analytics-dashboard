import OrdersTable from './OrdersTable';

import type { OrderDto } from '@/types';
import type { StoryObj } from '@storybook/react';

// Mock data with proper types matching OrderDto
const MOCK_ORDERS: OrderDto[] = [
  {
    id: '9613cdf1-272e-4901-8d0d-120e74a8d42b',
    product: 'Reactive Dashboard',
    date: '2023-04-25',
    total: 704.32,
    status: 3, // Shipped
    payment_method: 1, // Credit Card
  },
  {
    id: '067c4dcd-4b07-42b8-8cd0-55a6b3e9d608',
    product: 'Protocol Suite',
    date: '2023-06-11',
    total: 450.25,
    status: 3, // Shipped
    payment_method: 3, // PayPal
  },
  {
    id: '57c40c53-9fc8-427d-be5d-a0506cabc381',
    product: 'Triple-buffered System',
    date: '2022-11-24',
    total: 177.06,
    status: 2, // Processing
    payment_method: 2, // Debit Card
  },
  {
    id: '34d00d61-1b4d-40ed-81bf-8c2a3f9e44db',
    product: 'Enterprise Toolset',
    date: '2023-03-14',
    total: 821.33,
    status: 4, // Delivered
    payment_method: 2, // Debit Card
  },
  {
    id: '760368e7-07b2-4c9a-87f3-7bf7eb9fa106',
    product: 'Robust Framework',
    date: '2022-10-24',
    total: 639.56,
    status: 2, // Processing
    payment_method: 1, // Credit Card
  },
  {
    id: '0d8a8369-283b-4137-8a8e-953d753f121c',
    product: 'Client-Server Solution',
    date: '2023-07-01',
    total: 402.8,
    status: 1, // Pending
    payment_method: 1, // Credit Card
  },
  {
    id: '2465a917-571f-4b20-8328-213e674daf66',
    product: 'Mandatory License',
    date: '2022-12-10',
    total: 293.06,
    status: 5, // Cancelled
    payment_method: 3, // PayPal
  },
  {
    id: 'c245f961-0ecb-495b-8e4f-e012e71671b9',
    product: 'Multi-state Platform',
    date: '2023-01-23',
    total: 386.86,
    status: 3, // Shipped
    payment_method: 3, // PayPal
  },
];

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Orders/Table',
  component: OrdersTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrdersTable>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    data: MOCK_ORDERS,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    loading: true,
  },
};

export const Error: Story = {
  args: {
    data: [],
    error: 'Error loading orders',
  },
};
