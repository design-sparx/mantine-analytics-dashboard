"use client"

import {ActionIcon, Anchor, Container, Group, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "../../../mocks/Invoices.json";
import {IconDotsVertical} from "@tabler/icons-react";
import {Metadata} from "next";

const items = [
  {title: 'Dashboard', href: PATH_DASHBOARD.default},
  {title: 'Invoices', href: '#'},
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

const metadata: Metadata = {
  title: "Invoices | DesignSparx",
  description: "Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!",
};

function Page() {
  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Invoices" breadcrumbItems={items} invoiceAction={true}/>
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>Invoices</Text>
              <ActionIcon>
                <IconDotsVertical size={18}/>
              </ActionIcon>
            </Group>
            <InvoicesTable data={InvoicesData}/>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;