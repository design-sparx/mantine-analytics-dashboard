"use client"

import {ActionIcon, Anchor, Container, Group, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {OrdersTable, PageHeader} from "@/components";
import OrdersData from "../../mocks/Orders.json";
import {IconDotsVertical} from "@tabler/icons-react";
import {Metadata} from "next";

const items = [
  {title: 'Dashboard', href: PATH_DASHBOARD.default},
  {title: 'Orders', href: '#'},
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
  title: "Orders | DesignSparx",
  description: "Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!",
};

function Page() {
  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Orders" breadcrumbItems={items}/>
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>Orders</Text>
              <ActionIcon>
                <IconDotsVertical size={18}/>
              </ActionIcon>
            </Group>
            <OrdersTable data={OrdersData}/>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
