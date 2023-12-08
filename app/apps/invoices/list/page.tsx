'use client';

import {
  ActionIcon,
  Anchor,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { PATH_DASHBOARD } from '@/routes';
import { InvoicesTable, PageHeader } from '@/components';
import InvoicesData from '@/public/mocks/Invoices.json';
import { IconDotsVertical } from '@tabler/icons-react';
import { Metadata } from 'next';
import { useFetchData } from '@/hooks';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Invoices', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Page() {
  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
  } = useFetchData('/mocks/Invoices.json');

  return (
    <>
      <>
        <title>Invoices | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Invoices"
            breadcrumbItems={items}
            invoiceAction={true}
          />
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Invoices
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <InvoicesTable
              data={invoicesData}
              error={invoicesError}
              loading={invoicesLoading}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
