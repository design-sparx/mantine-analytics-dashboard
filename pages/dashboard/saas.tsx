import React from 'react';
import Head from "next/head";
import {
    ActionIcon,
    Button,
    Container,
    Divider,
    Grid,
    Group,
    Paper,
    PaperProps,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import {IconChevronRight, IconRefresh} from "@tabler/icons-react";
import {FilterDateMenu, MapChart, PageHeader, ProjectsTable, RevenueChart, SalesChart, StatsGrid} from "@/components";
import StatsData from "../../mocks/StatsGrid.json"
import ProjectsData from "../../mocks/Projects.json"
import {AppLayout} from "@/layout";

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
    sx: {height: '100%'}
}

function Saas() {
    return (
        <>
            <Head>
                <title>Saas Dashboard | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Saas dashboard" withActions={true}/>
                        <StatsGrid data={StatsData.data} paperProps={PAPER_PROPS}/>
                        <Grid>
                            <Grid.Col lg={5}>
                                <MapChart {...PAPER_PROPS}/>
                            </Grid.Col>
                            <Grid.Col lg={7}>
                                <RevenueChart {...PAPER_PROPS}/>
                            </Grid.Col>
                            <Grid.Col lg={4}>
                                <SalesChart {...PAPER_PROPS}/>
                            </Grid.Col>
                            <Grid.Col lg={8}>
                                <Paper {...PAPER_PROPS}>
                                    <Group position="apart" mb="md">
                                        <Text size="lg" fw={600}>Tasks</Text>
                                        <Button variant="subtle" rightIcon={<IconChevronRight size={18}/>}>View all</Button>
                                    </Group>
                                    <ProjectsTable data={ProjectsData.slice(0, 6)}/>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Saas;
