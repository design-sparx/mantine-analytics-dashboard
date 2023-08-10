import React from 'react';
import Head from "next/head";
import {Anchor, Breadcrumbs, Container, Paper, PaperProps, Stack, Text, Title} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {AppLayout} from "@/layout";
import {PageHeader} from "@/components";

const items = [
    {title: 'Dashboard', href: PATH_DASHBOARD.default},
    {title: 'Pages', href: '#'},
    {title: 'Blank', href: '#'},
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

function Pricing() {
    return (
        <>
            <Head>
                <title>Blank page | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container>
                    <Stack spacing="lg">
                        <PageHeader title="Blank page" breadcrumbItems={items}/>
                        <Paper {...PAPER_PROPS}>
                            <Text size="lg" fw={600}>Empty card header</Text>
                            <Text>Empty card text</Text>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Pricing;
