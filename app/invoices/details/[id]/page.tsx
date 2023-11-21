"use client"

import React, {useEffect, useState} from 'react';
import {Anchor, Container, PaperProps, Stack} from "@mantine/core";
import {InvoiceDetailsCard, PageHeader} from "@/components";
import {PATH_DASHBOARD, PATH_INVOICES} from "@/routes";
import {Invoices} from "@/types";
import InvoicesData from "@/mocks/Invoices.json";

const items = [
  {title: 'Dashboard', href: PATH_DASHBOARD.default},
  {title: 'Invoices', href: PATH_INVOICES.invoices.all},
  {title: 'Details', href: '#'},
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: "md",
  shadow: "md",
  radius: "md",
}

function InvoiceDetails({params}: { params: { id: string } }) {
  const [selectedData, setSelectedData] = useState<Invoices>();

  useEffect(() => {
    setSelectedData(InvoicesData.find(_ => _.id === params.id))
  }, [InvoicesData, params]);

  return (
    <>
      <head>
        <title>Invoice - {selectedData ? selectedData?.id : "No invoice found"} | DesignSparx</title>
      </head>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title={`Invoice #${selectedData?.id.slice(0, 7)}`}
            breadcrumbItems={items}
          />
          <InvoiceDetailsCard data={selectedData} {...PAPER_PROPS}/>
        </Stack>
      </Container>
    </>
  );
}

export default InvoiceDetails;
