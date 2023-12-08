'use client';

import { Anchor, Container, PaperProps, Stack } from '@mantine/core';
import { InvoiceDetailsCard, PageHeader } from '@/components';
import { PATH_DASHBOARD, PATH_INVOICES } from '@/routes';
import { Metadata } from 'next';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Invoices', href: PATH_INVOICES.invoices.all },
  { title: 'Details', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const sampleData = {
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

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

const metadata: Metadata = {
  title: 'Sample Invoice | DesignSparx',
  description:
    'Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!',
};

function SampleInvoiceDetails() {
  return (
    <>
      <>
        <title>Sample Invoice Details | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title={`Invoice #${sampleData.id.slice(0, 7)}`}
            breadcrumbItems={items}
          />
          <InvoiceDetailsCard data={sampleData} {...PAPER_PROPS} />
        </Stack>
      </Container>
    </>
  );
}

export default SampleInvoiceDetails;
