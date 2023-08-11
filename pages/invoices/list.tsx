import React from 'react';
import Head from "next/head";
import {ActionIcon, Anchor, Container, Group, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "../../mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconDotsVertical} from "@tabler/icons-react";

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

function List() {
    return (
        <>
            <Head>
                <title>Invoices | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Invoices" breadcrumbItems={items} invoiceAction={true}/>
                        <Paper {...PAPER_PROPS}>
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Invoices</Text>
                                <ActionIcon>
                                    <IconDotsVertical size={18}/>
                                </ActionIcon>
                            </Group>
                            <InvoicesTable data={InvoicesData}/>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default List;
