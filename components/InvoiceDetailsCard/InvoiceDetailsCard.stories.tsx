import InvoiceDetailsCard from './InvoiceDetailsCard';

import type { StoryObj } from '@storybook/react';


const MOCKS = {
  id: '8677a3e2-dde3-4d04-8edd-9d0bcf178f89',
  full_name: 'Dannie MacTrustie',
  email: 'atysack2r@washingtonpost.com',
  address: '5160 Iowa Point',
  country: 'China',
  status: 'approved',
  amount: 6221.88,
  issue_date: '7/12/2022',
  description:
    'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
  client_email: 'atysack2r@illinois.edu',
  client_address: '13 Loeprich Point',
  client_country: 'Russia',
  client_name: 'Alayne Tysack',
  client_company: 'Raynor and Sons',
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Invoices/Card',
  component: InvoiceDetailsCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InvoiceDetailsCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    data: MOCKS,
    style: { width: 700 },
  },
};
