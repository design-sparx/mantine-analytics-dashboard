import {
  Container,
  Grid,
  GridCol,
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
import { loadMock } from '@/lib/api/mock-route';

import type { CoreStatsDto } from '@/types/dashboard';
import type { LanguagesDto, TrafficDto } from '@/types/generated-fixtures';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
};

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

export default async function Page() {
  const [statsResult, languagesResult, trafficResult] = await Promise.all([
    loadMock<CoreStatsDto>('StatsGrid.json'),
    loadMock<LanguagesDto[]>('Languages.json'),
    loadMock<TrafficDto[]>('Traffic.json'),
  ]);

  const statsData = statsResult.data?.data ?? [];
  const languagesData = languagesResult.data ?? [];
  const trafficData = trafficResult.data ?? [];

  return (
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
          <GridCol span={{ base: 12, md: 6, lg: 8 }}>
            <MapChart {...PAPER_PROPS} />
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <SalesChart {...PAPER_PROPS} />
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <LanguageTable
              data={languagesData?.slice(0, 6)}
              error={languagesResult.error}
              loading={false}
              {...PAPER_PROPS}
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 8 }}>
            <TrafficTable
              data={trafficData?.slice(0, 6)}
              error={trafficResult.error}
              loading={false}
              {...PAPER_PROPS}
            />
          </GridCol>
        </Grid>
      </Stack>
    </Container>
  );
}
