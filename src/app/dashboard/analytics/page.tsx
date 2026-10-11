import {
  Container,
  Grid,
  PaperProps,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core';

import { ErrorAlert, PageHeader, StatsCard, Surface } from '@/components';
import LanguageTable from '@/components/language-table/LanguageTableClient';
import MapChart from '@/components/map-chart/MapChartClient';
import MobileDesktopChart from '@/components/mobile-desktop-chart/MobileDesktopChartClient';
import SalesChart from '@/components/sales-chart/SalesChartClient';
import TrafficTable from '@/components/traffic-table/TrafficTableClient';
import { API_CORE } from '@/routes/api';

export const dynamic = 'force-dynamic';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

async function fetchData<T>(endpoint: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`,
    {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) return { data: null, error: 'Failed to fetch', loading: false };
  return res.json();
}

export default async function Page() {
  const [statsResult, languagesResult, trafficResult] = await Promise.all([
    fetchData(API_CORE.stats),
    fetchData(API_CORE.languages),
    fetchData(API_CORE.traffic),
  ]);

  const statsData = statsResult.data?.data ?? statsResult.data ?? [];
  const languagesData = languagesResult.data ?? [];
  const trafficData = trafficResult.data ?? [];

  return (
    <>
      <>
        <title>Analytics Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Analytics dashboard" withActions={true} />
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 2 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            {statsResult.error ? (
              <ErrorAlert
                title="Error loading stats"
                message={statsResult.error}
              />
            ) : (
              <SimpleGrid cols={2}>
                {statsData
                  ?.slice(0, 4)
                  ?.map((s: any) => (
                    <StatsCard key={s.title} data={s} {...PAPER_PROPS} />
                  ))}
              </SimpleGrid>
            )}
            <MobileDesktopChart {...PAPER_PROPS} />
          </SimpleGrid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
              <MapChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <SalesChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <LanguageTable
                data={languagesData?.slice(0, 6)}
                error={languagesResult.error}
                loading={false}
                {...PAPER_PROPS}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
              <TrafficTable
                data={trafficData?.slice(0, 6)}
                error={trafficResult.error}
                loading={false}
                {...PAPER_PROPS}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
