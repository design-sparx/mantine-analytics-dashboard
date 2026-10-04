'use client';

import { Container, Grid, PaperProps, Stack, Text } from '@mantine/core';

import {
  CostAnalysisChart,
  ModelUsageTable,
  PageHeader,
  PerformanceMetricsChart,
  StatsGrid,
  Surface,
  TokenUsageChart,
  UseCaseChart,
} from '@/components';
import {
  useLlmCosts,
  useLlmModelUsage,
  useLlmPerformance,
  useLlmStats,
  useLlmTokenTrends,
  useLlmUseCases,
} from '@/lib/api/endpointHooks';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

function Page() {
  const { data: stats, loading: statsLoading, error: statsError } = useLlmStats();
  const { data: models, loading: modelsLoading, error: modelsError } =
    useLlmModelUsage();
  const { data: tokens, loading: tokensLoading, error: tokensError } =
    useLlmTokenTrends();
  const { data: useCases, loading: useCasesLoading, error: useCasesError } =
    useLlmUseCases();
  const { data: performance, loading: performanceLoading, error: performanceError } =
    useLlmPerformance();
  const { data: costs, loading: costsLoading, error: costsError } = useLlmCosts();

  return (
    <>
      <>
        <title>LLM/AI Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="LLM and AI dashboard for tracking API usage, model performance, token consumption, and cost analysis. Monitor AI model metrics and optimize resource usage."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="LLM/AI dashboard" withActions={true} />

          <StatsGrid
            data={stats}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Token Usage Trends
                </Text>
                <TokenUsageChart
                  data={tokens}
                  error={tokensError}
                  loading={tokensLoading}
                />
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Use Case Distribution
                </Text>
                <UseCaseChart
                  data={useCases}
                  error={useCasesError}
                  loading={useCasesLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Performance Metrics
                </Text>
                <PerformanceMetricsChart
                  data={performance}
                  error={performanceError}
                  loading={performanceLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Cost Analysis
                </Text>
                <CostAnalysisChart
                  data={costs}
                  error={costsError}
                  loading={costsLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={12}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Model Usage Statistics
                </Text>
                <ModelUsageTable
                  data={models}
                  error={modelsError}
                  loading={modelsLoading}
                />
              </Surface>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
