import React from 'react';
import Head from "next/head";
import {AppLayout} from "@/layout";
import {ActionIcon, Anchor, Container, Group, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {OrdersTable, PageHeader} from "@/components";
import OrdersData from "../../mocks/Orders.json";
import {IconDotsVertical} from "@tabler/icons-react";

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

function Orders() {
    return (
        <>
            <Head>
                <title>Orders | DesignSparx</title>
            </Head>
            <AppLayout>
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
            </AppLayout>
        </>
    );
}

export default Orders;
