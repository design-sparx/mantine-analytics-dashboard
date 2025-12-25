'use client';

import {
  Container,
  Grid,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';

import {
  PageHeader,
  StatsGrid,
  Surface,
  CashflowChart,
  ExpenseBreakdown,
  FinanceInvoicesTable,
} from '@/components';
import { useFetch } from '@mantine/hooks';
import { IApiResponse } from '@/types/api-response';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

function Page() {
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useFetch<IApiResponse<any[]>>('/api/finance/stats');

  const {
    data: cashflowData,
    error: cashflowError,
    loading: cashflowLoading,
  } = useFetch<IApiResponse<any[]>>('/api/finance/cashflow');

  const {
    data: expensesData,
    error: expensesError,
    loading: expensesLoading,
  } = useFetch<IApiResponse<any[]>>('/api/finance/expenses');

  const {
    data: invoicesData,
    error: invoicesError,
    loading: invoicesLoading,
  } = useFetch<IApiResponse<any[]>>('/api/finance/invoices');

  return (
    <>
      <>
        <title>Finance Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Finance dashboard for financial management, cashflow tracking, expense analysis, and invoice monitoring. Track profit margins, revenue, and expenses."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Finance dashboard" withActions={true} />

          <StatsGrid
            data={statsData?.data || []}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface {...PAPER_PROPS}>
                <CashflowChart
                  data={cashflowData?.data || []}
                  error={cashflowError}
                  loading={cashflowLoading}
                />
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface {...PAPER_PROPS}>
                <ExpenseBreakdown
                  data={expensesData?.data || []}
                  error={expensesError}
                  loading={expensesLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={12}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Recent Invoices
                </Text>
                <FinanceInvoicesTable
                  data={invoicesData?.data || []}
                  error={invoicesError}
                  loading={invoicesLoading}
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
