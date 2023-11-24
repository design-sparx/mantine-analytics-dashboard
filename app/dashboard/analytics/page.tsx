"use client"

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
import StatsData from "@/public/mocks/StatsGrid.json";
import LanguagesData from "@/public/mocks/Languages.json";
import TrafficData from "@/public/mocks/Traffic.json";
import {Metadata} from "next";
const PRIMARY_COL_HEIGHT = rem(300);

const PAPER_PROPS: PaperProps = {
  p: "md",
  shadow: "md",
  radius: "md",
  style: {height: '100%'}
}

function Page() {
  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <>
      <>
        <title>Analytics Dashboard | DesignSparx</title>
        <meta name="description"
              content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"/>
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Analytics dashboard" withActions={true}/>
          <SimpleGrid
            cols={{base: 1, sm: 2, lg: 2}}
            spacing={{base: 10, sm: 'xl'}}
            verticalSpacing={{base: 'md', sm: 'xl'}}
          >
            <SimpleGrid cols={2}>
              {StatsData?.data.map(s => <StatsCard key={s.title} data={s} {...PAPER_PROPS}/>)}
            </SimpleGrid>
            <MobileDesktopChart {...PAPER_PROPS}/>
          </SimpleGrid>
          <Grid>
            <Grid.Col span={{base: 12, md: 6, lg: 8}}>
              <MapChart {...PAPER_PROPS}/>
            </Grid.Col>
            <Grid.Col span={{base: 12, md: 6, lg: 4}}>
              <SalesChart {...PAPER_PROPS}/>
            </Grid.Col>
            <Grid.Col span={{base: 12, md: 6, lg: 4}}>
              <LanguageTable data={LanguagesData.slice(0, 6)} {...PAPER_PROPS}/>
            </Grid.Col>
            <Grid.Col span={{base: 12, md: 6, lg: 8}}>
              <TrafficTable data={TrafficData.slice(0, 6)} {...PAPER_PROPS}/>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
