'use client';

import { useEffect, useState } from 'react';
import { Anchor, Container, PaperProps, Stack } from '@mantine/core';
import { InvoiceDetailsCard, PageHeader } from '@/components';
import { PATH_DASHBOARD, PATH_INVOICES } from '@/routes';
import { Invoices } from '@/types';
import { useFetchData } from '@/hooks';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Invoices', href: PATH_INVOICES.invoices.all },
  { title: 'Details', href: '#' },
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

function InvoiceDetails({ params }: { params: { id: string } }) {
  const [selectedData, setSelectedData] = useState<Invoices>();
  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
  } = useFetchData('mocks/Invoices.json');

  useEffect(() => {
    setSelectedData(invoicesData.find((_: Invoices) => _.id === params.id));
  }, [invoicesData, params]);

  return (
    <>
      <>
        <title>
          Invoice - {selectedData ? selectedData?.id : 'No invoice found'} |
          DesignSparx
        </title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title={`Invoice #${selectedData?.id.slice(0, 7)}`}
            breadcrumbItems={items}
          />
          <InvoiceDetailsCard data={selectedData} {...PAPER_PROPS} />
        </Stack>
      </Container>
    </>
  );
}

export default InvoiceDetails;
