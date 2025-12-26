import { ReactNode } from 'react';

/**
 * Common chart size options
 */
export type ChartSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Chart color scheme
 */
export type ChartColorScheme = string[];

/**
 * Common data point for time series
 */
export type TimeSeriesDataPoint = {
  /** Date/time for the data point */
  date: string | Date;
  /** Value for the data point */
  value: number;
  /** Optional label */
  label?: string;
};

/**
 * Category data point for bar/column charts
 */
export type CategoryDataPoint = {
  /** Category name */
  category: string;
  /** Value for the category */
  value: number;
  /** Optional color override */
  color?: string;
};

/**
 * Multi-series data point
 */
export type MultiSeriesDataPoint = {
  /** X-axis value (usually category or date) */
  x: string | number | Date;
  /** Multiple Y values for different series */
  [seriesName: string]: string | number | Date;
};

/**
 * Pie chart data point
 */
export type PieDataPoint = {
  /** Slice label */
  name: string;
  /** Slice value */
  value: number;
  /** Optional color */
  color?: string;
};

/**
 * Chart legend configuration
 */
export type ChartLegend = {
  /** Whether to show legend */
  show: boolean;
  /** Legend position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Legend alignment */
  align?: 'start' | 'center' | 'end';
};

/**
 * Chart tooltip configuration
 */
export type ChartTooltip = {
  /** Whether to show tooltip */
  show: boolean;
  /** Custom tooltip formatter */
  formatter?: (value: number, context: unknown) => string;
  /** Custom tooltip render function */
  render?: (data: unknown) => ReactNode;
};

/**
 * Chart axis configuration
 */
export type ChartAxis = {
  /** Axis label */
  label?: string;
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Tick interval */
  tickInterval?: number;
  /** Custom tick formatter */
  tickFormatter?: (value: number | string) => string;
};

/**
 * Base chart props
 */
export type BaseChartProps = {
  /** Chart title */
  title?: ReactNode;
  /** Chart description */
  description?: string;
  /** Chart height in pixels */
  height?: number;
  /** Chart width (usually responsive) */
  width?: string | number;
  /** Color scheme for the chart */
  colors?: ChartColorScheme;
  /** Whether data is loading */
  loading?: boolean;
  /** Error state */
  error?: Error | string | null;
  /** Legend configuration */
  legend?: ChartLegend;
  /** Tooltip configuration */
  tooltip?: ChartTooltip;
  /** Whether chart is animated */
  animated?: boolean;
  /** Custom className */
  className?: string;
};

/**
 * Time series chart props
 */
export type TimeSeriesChartProps = BaseChartProps & {
  /** Time series data */
  data: TimeSeriesDataPoint[];
  /** X-axis configuration */
  xAxis?: ChartAxis;
  /** Y-axis configuration */
  yAxis?: ChartAxis;
  /** Whether to show area under the line */
  area?: boolean;
  /** Curve type */
  curve?: 'linear' | 'smooth' | 'step';
};

/**
 * Bar/Column chart props
 */
export type BarChartProps = BaseChartProps & {
  /** Category data */
  data: CategoryDataPoint[];
  /** Chart orientation */
  orientation?: 'vertical' | 'horizontal';
  /** X-axis configuration */
  xAxis?: ChartAxis;
  /** Y-axis configuration */
  yAxis?: ChartAxis;
  /** Whether bars are stacked */
  stacked?: boolean;
};

/**
 * Multi-series chart props
 */
export type MultiSeriesChartProps = BaseChartProps & {
  /** Multi-series data */
  data: MultiSeriesDataPoint[];
  /** Series configuration */
  series: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  /** X-axis configuration */
  xAxis?: ChartAxis;
  /** Y-axis configuration */
  yAxis?: ChartAxis;
  /** Chart type */
  type?: 'line' | 'bar' | 'area';
  /** Whether series are stacked */
  stacked?: boolean;
};

/**
 * Pie/Donut chart props
 */
export type PieChartProps = BaseChartProps & {
  /** Pie data */
  data: PieDataPoint[];
  /** Whether to show as donut chart */
  donut?: boolean;
  /** Inner radius for donut (0-1) */
  innerRadius?: number;
  /** Whether to show labels */
  showLabels?: boolean;
  /** Whether to show values */
  showValues?: boolean;
};

/**
 * Chart data transformation utilities type
 */
export type ChartDataTransformer<TInput, TOutput> = (data: TInput[]) => TOutput[];

/**
 * Chart export options
 */
export type ChartExportOptions = {
  /** Export format */
  format: 'png' | 'svg' | 'pdf' | 'csv';
  /** File name */
  filename?: string;
  /** Export quality (for raster formats) */
  quality?: number;
};

/**
 * Chart responsive configuration
 */
export type ChartResponsive = {
  /** Breakpoint definitions */
  breakpoints?: Array<{
    minWidth: number;
    options: Partial<BaseChartProps>;
  }>;
};
