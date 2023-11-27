'use client';

import {
  Container,
  Grid,
  PaperProps,
  rem,
  SimpleGrid,
  Skeleton,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import {
  ErrorAlert,
  LanguageTable,
  MapChart,
  MobileDesktopChart,
  PageHeader,
  SalesChart,
  StatsCard,
  TrafficTable,
} from '@/components';
import { useFetchData } from '@/hooks';

const PRIMARY_COL_HEIGHT = rem(300);

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function Page() {
  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useFetchData('/mocks/StatsGrid.json');
  const {
    data: languagesData,
    error: languageError,
    loading: languageLoading,
  } = useFetchData('/mocks/Languages.json');
  const {
    data: trafficData,
    error: trafficError,
    loading: trafficLoading,
  } = useFetchData('/mocks/Traffic.json');

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
            {statsError ? (
              <ErrorAlert
                title="Error loading stats"
                message={statsError.toString()}
              />
            ) : (
              <SimpleGrid cols={2}>
                {statsLoading
                  ? Array.from({ length: 4 }).map((o, i) => (
                      <Skeleton
                        key={`stats-loading-${i}`}
                        visible={true}
                        height={200}
                      />
                    ))
                  : statsData?.data?.map((s: any) => (
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
                data={languagesData.slice(0, 6)}
                error={languageError}
                loading={languageLoading}
                {...PAPER_PROPS}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
              <TrafficTable
                data={trafficData.slice(0, 6)}
                error={trafficError}
                loading={trafficLoading}
                {...PAPER_PROPS}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
