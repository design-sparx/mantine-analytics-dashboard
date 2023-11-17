import React from 'react';
import Head from "next/head";
import {AppLayout} from "@/layout";
import {Container, Grid, PaperProps, rem, SimpleGrid, Stack, useMantineTheme} from "@mantine/core";
import {
  LanguageTable,
  MapChart,
  MobileDesktopChart,
  PageHeader,
  SalesChart,
  StatsCard,
  TrafficTable
} from "@/components";
import StatsData from "../../../mocks/StatsGrid.json";
import LanguagesData from "../../../mocks/Languages.json";
import TrafficData from "../../../mocks/Traffic.json";

const PRIMARY_COL_HEIGHT = rem(300);

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
    style: {height: '100%'}
}

function Page() {
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

    return (
        <>
            <Head>
                <title>Page Dashboard | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Page dashboard" withActions={true}/>
                        <SimpleGrid cols={2} spacing="md" breakpoints={[{maxWidth: 'sm', cols: 1}]}>
                            <SimpleGrid cols={2}>
                                {StatsData?.data.map(s => <StatsCard key={s.title} data={s} {...PAPER_PROPS}/>)}
                            </SimpleGrid>
                            <MobileDesktopChart {...PAPER_PROPS}/>
                        </SimpleGrid>
                        <Grid>
                            <Grid.Col lg={8}>
                                <MapChart {...PAPER_PROPS}/>
                            </Grid.Col>
                            <Grid.Col lg={4}>
                                <SalesChart {...PAPER_PROPS}/>
                            </Grid.Col>
                            <Grid.Col lg={4}>
                                <LanguageTable data={LanguagesData.slice(0, 6)} {...PAPER_PROPS}/>
                            </Grid.Col>
                            <Grid.Col lg={8}>
                                <TrafficTable data={TrafficData.slice(0, 6)} {...PAPER_PROPS}/>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Page;
