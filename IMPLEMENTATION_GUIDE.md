# Implementation Guide for New Dashboards

## Architecture Overview

This guide documents the patterns and structure for implementing the three new dashboards: Marketing, Healthcare, and Education.

## Current Dashboard Architecture Analysis

### Data Flow Pattern

1. **Mock JSON Data** (`public/mocks/*.json`)
   - All data stored as JSON files
   - Contains realistic mock data
   - No hardcoded constants in components

2. **API Routes** (`src/app/api/[dashboard]/[endpoint]/route.ts`)
   - Read JSON files from `public/mocks/`
   - Return standardized `IApiResponse` format
   - Handle errors gracefully

3. **Custom Hooks** (`src/lib/hooks/useApi.ts`)
   - Use Mantine's `useFetch` hook
   - Typed with `IApiResponse<T>`
   - Reusable across components

4. **Dashboard Pages** (`src/app/dashboard/[name]/page.tsx`)
   - Use `'use client'` directive
   - Fetch data via custom hooks or direct `useFetch`
   - Pass data to components as props

5. **Custom Components** (`src/components/[dashboard-name]/[component-name]/`)
   - Receive data, loading, error states as props
   - Handle their own UI states (loading, error, empty)
   - Styled with CSS modules

### File Naming Convention

**IMPORTANT**: All new component files should use **kebab-case** naming:
- ✅ `top-products-table.tsx`
- ✅ `expense-breakdown.tsx`
- ❌ `TopProductsTable.tsx` (old pattern, don't use for new files)

## Standard Directory Structure

### Dashboard Page
```
src/app/dashboard/[dashboard-name]/
  └── page.tsx
```

### API Routes
```
src/app/api/[dashboard-name]/
  ├── stats/
  │   └── route.ts
  ├── [endpoint-1]/
  │   └── route.ts
  └── [endpoint-2]/
      └── route.ts
```

### Mock Data
```
public/mocks/
  ├── [dashboard-name]-stats.json
  ├── [endpoint-1].json
  └── [endpoint-2].json
```

### Components (Dashboard-Specific)
```
src/components/[dashboard-name]-dashboard/
  ├── [component-name]/
  │   ├── index.ts              (barrel export)
  │   ├── [component-name].tsx  (kebab-case!)
  │   └── [component-name].module.css
  └── [another-component]/
      ├── index.ts
      ├── [another-component].tsx
      └── [another-component].module.css
```

## Implementation Pattern

### 1. Create Mock Data Files

**Example**: `public/mocks/marketing-stats.json`
```json
[
  {
    "title": "Campaign ROI",
    "value": "245%",
    "diff": 12.5,
    "period": "vs last month",
    "icon": "chart-line",
    "color": "blue"
  },
  {
    "title": "Active Campaigns",
    "value": "24",
    "diff": 8.3,
    "period": "vs last month",
    "icon": "ad",
    "color": "teal"
  }
]
```

### 2. Create API Routes

**Example**: `src/app/api/marketing/stats/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'marketing-stats.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    return NextResponse.json({
      succeeded: true,
      data,
      errors: [],
      message: 'Marketing stats retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch marketing stats'],
        message: 'Error retrieving data',
      },
      { status: 500 }
    );
  }
}
```

### 3. Create Dashboard Page

**Example**: `src/app/dashboard/marketing/page.tsx`
```typescript
'use client';

import {
  Container,
  Grid,
  PaperProps,
  Stack,
} from '@mantine/core';

import {
  PageHeader,
  StatsGrid,
  Surface,
  CampaignPerformanceChart,
  SocialMediaStats,
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
  } = useFetch<IApiResponse<any[]>>('/api/marketing/stats');

  const {
    data: campaignsData,
    error: campaignsError,
    loading: campaignsLoading,
  } = useFetch<IApiResponse<any[]>>('/api/marketing/campaigns');

  return (
    <>
      <>
        <title>Marketing Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Marketing dashboard for campaign tracking, social media analytics, and marketing performance metrics."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Marketing dashboard" withActions={true} />

          <StatsGrid
            data={statsData?.data || []}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface {...PAPER_PROPS}>
                <CampaignPerformanceChart
                  data={campaignsData?.data || []}
                  error={campaignsError}
                  loading={campaignsLoading}
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
```

### 4. Create Custom Components

**Directory**: `src/components/marketing-dashboard/campaign-performance-chart/`

**File**: `campaign-performance-chart.tsx` (kebab-case!)
```typescript
import { Text, Skeleton, Stack } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface Campaign {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface CampaignPerformanceChartProps {
  data?: Campaign[];
  loading?: boolean;
  error?: Error | null;
}

export const CampaignPerformanceChart: React.FC<CampaignPerformanceChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading campaign data"
        message={error.message || 'Failed to load campaigns'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        <Skeleton height={300} radius="sm" />
      </Stack>
    );
  }

  return (
    <>
      <Text size="lg" fw={600} mb="md">
        Campaign Performance
      </Text>
      <LineChart
        h={300}
        data={data}
        dataKey="date"
        series={[
          { name: 'impressions', color: 'blue' },
          { name: 'clicks', color: 'teal' },
          { name: 'conversions', color: 'violet' },
        ]}
      />
    </>
  );
};
```

**File**: `index.ts` (barrel export)
```typescript
export { CampaignPerformanceChart } from './campaign-performance-chart';
```

**File**: `campaign-performance-chart.module.css`
```css
.root {
  /* Component-specific styles */
}
```

### 5. Export Components

Add to `src/components/index.ts`:
```typescript
// Marketing Dashboard Components
export { CampaignPerformanceChart } from './marketing-dashboard/campaign-performance-chart';
export { SocialMediaStats } from './marketing-dashboard/social-media-stats';
```

## Theme and Styling Guidelines

### Theme System

The project uses a **dynamic theme system** powered by `ThemeCustomizerContext`:

**DO:**
- Use Mantine's color props: `color="blue"`, `c="dimmed"`, `bg="dark"`
- Use theme tokens: `variant="light"`, `size="sm"`, `radius="md"`
- Leverage CSS variables from theme: `var(--mantine-color-blue-6)`
- Use Mantine's style props for spacing: `p="md"`, `mb="lg"`, `gap="sm"`

**DON'T:**
- Use inline color styles: `style={{ color: '#3b82f6' }}`
- Hardcode CSS colors: `backgroundColor: 'blue'`
- Use arbitrary color values when theme colors exist
- Add excessive CSS for things Mantine provides out of the box

**Example - Good:**
```tsx
<Paper p="md" radius="md" withBorder>
  <Text size="lg" fw={600} c="dimmed">
    Dashboard Stats
  </Text>
  <Badge color="blue" variant="light">
    Active
  </Badge>
</Paper>
```

**Example - Bad:**
```tsx
<Paper style={{ padding: '16px', borderRadius: '8px', border: '1px solid #ccc' }}>
  <Text style={{ fontSize: '18px', fontWeight: 600, color: '#666' }}>
    Dashboard Stats
  </Text>
  <Badge style={{ backgroundColor: '#3b82f6', color: 'white' }}>
    Active
  </Badge>
</Paper>
```

### Chart Library

**IMPORTANT:** All new dashboards must use **Mantine Charts** (built on Recharts):

**Available Chart Types:**
- `LineChart` - For trends over time
- `BarChart` - For comparisons
- `AreaChart` - For cumulative data
- `PieChart` - For proportions
- `DonutChart` - For proportions with center space
- `RadarChart` - For multi-dimensional data
- `SparklineChart` - For small inline charts
- `CompositeChart` - For combining multiple series types

**Chart Setup:**
```tsx
import { LineChart, BarChart, DonutChart } from '@mantine/charts';

// Line Chart Example
<LineChart
  h={300}
  data={data}
  dataKey="date"
  series={[
    { name: 'revenue', color: 'blue' },
    { name: 'expenses', color: 'red' },
  ]}
  curveType="natural"
  withLegend
  withTooltip
/>

// Bar Chart Example
<BarChart
  h={300}
  data={data}
  dataKey="month"
  series={[
    { name: 'sales', color: 'teal' },
    { name: 'target', color: 'blue' },
  ]}
  withLegend
/>

// Donut Chart Example
<DonutChart
  data={data}
  withLabels
  withTooltip
/>
```

**Chart Data Format:**
```json
// Line/Bar/Area charts
[
  { "date": "Jan", "revenue": 4000, "expenses": 2400 },
  { "date": "Feb", "revenue": 3000, "expenses": 1398 }
]

// Pie/Donut charts
[
  { "name": "USA", "value": 400, "color": "blue.6" },
  { "name": "India", "value": 300, "color": "teal.6" }
]
```

**DON'T:**
- Use ApexCharts for new dashboards (legacy)
- Create custom chart components when Mantine Charts suffice
- Hardcode chart colors - use theme colors

## Key Principles

### ✅ DO

- Store ALL data in JSON files (`public/mocks/`)
- Use `useFetch` from `@mantine/hooks` for data fetching
- Use kebab-case for new component filenames
- Pass data, loading, error as props to components
- Handle loading/error states in components
- Use `IApiResponse<T>` type for API responses
- Follow the established folder structure
- Use Mantine Charts (Recharts) for all visualizations
- Use Mantine theme colors and style props
- Use CSS modules only for custom layouts/positioning
- Create barrel exports (`index.ts`) for components

### ❌ DON'T

- Hardcode data in components or constants
- Use PascalCase for new component filenames (old pattern)
- Mix data fetching logic inside components
- Skip error handling in API routes
- Create components without proper loading states
- Use ApexCharts for new dashboards
- Use inline styles for colors/theming
- Hardcode colors or spacing values
- Forget to export components in main `index.ts`

## Component Props Pattern

All custom dashboard components should follow this pattern:

```typescript
interface ComponentProps {
  data?: DataType[];        // Optional with default []
  loading?: boolean;        // Optional with default false
  error?: Error | null;     // Optional with default null
}

export const Component: React.FC<ComponentProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  // Handle error state
  if (error) {
    return <ErrorAlert title="..." message={error.message} />;
  }

  // Handle loading state
  if (loading) {
    return <Skeleton ... />;
  }

  // Render data
  return <>{/* component UI */}</>;
};
```

## API Response Format

All API routes must return this format:

```typescript
{
  succeeded: boolean;
  data: T;
  errors: string[];
  message: string;
}
```

## Next Steps for New Dashboards

1. ✅ Create mock JSON data files
2. ✅ Create API routes
3. ✅ Create dashboard page
4. ✅ Create custom components (kebab-case filenames!)
5. ✅ Update routes in `src/routes/index.ts`
6. ✅ Export components in `src/components/index.ts`
7. ✅ Test data flow and error handling

## File Naming Summary

```
✅ CORRECT (New Pattern):
src/components/marketing-dashboard/
  └── campaign-performance-chart/
      ├── index.ts
      ├── campaign-performance-chart.tsx     ← kebab-case
      └── campaign-performance-chart.module.css

❌ INCORRECT (Old Pattern - Don't Use):
src/components/marketing-dashboard/
  └── CampaignPerformanceChart/
      ├── index.ts
      ├── CampaignPerformanceChart.tsx       ← PascalCase (old)
      └── CampaignPerformanceChart.module.css
```

Note: Component export names should still be PascalCase, only the **filenames** should be kebab-case.
