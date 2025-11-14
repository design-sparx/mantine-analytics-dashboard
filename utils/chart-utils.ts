/**
 * Chart Utilities
 *
 * Shared utilities for working with chart components
 */

import { ChartColorScheme } from '@/types/chart';

/**
 * Default color schemes for charts
 */
export const CHART_COLOR_SCHEMES = {
  default: ['#228be6', '#12b886', '#fab005', '#fa5252', '#e64980', '#be4bdb'],
  blue: ['#4dabf7', '#228be6', '#1c7ed6', '#1971c2', '#1864ab'],
  green: ['#51cf66', '#37b24d', '#2f9e44', '#2b8a3e', '#087f5b'],
  red: ['#ff6b6b', '#fa5252', '#f03e3e', '#e03131', '#c92a2a'],
  purple: ['#cc5de8', '#be4bdb', '#ae3ec9', '#9c36b5', '#862e9c'],
  yellow: ['#ffd43b', '#fab005', '#f59f00', '#f08c00', '#e67700'],
  teal: ['#3bc9db', '#15aabf', '#1098ad', '#0c8599', '#0b7285'],
} as const;

/**
 * Get a color from the default color scheme
 */
export function getChartColor(index: number, scheme: keyof typeof CHART_COLOR_SCHEMES = 'default'): string {
  const colors = CHART_COLOR_SCHEMES[scheme];
  return colors[index % colors.length];
}

/**
 * Get multiple colors from a color scheme
 */
export function getChartColors(count: number, scheme: keyof typeof CHART_COLOR_SCHEMES = 'default'): string[] {
  const colors = CHART_COLOR_SCHEMES[scheme];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}

/**
 * Format number with appropriate suffix (K, M, B)
 */
export function formatChartNumber(value: number, decimals: number = 1): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}

/**
 * Format currency for chart display
 */
export function formatChartCurrency(value: number, currency: string = 'USD', decimals: number = 0): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(decimals)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage for chart display
 */
export function formatChartPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date for chart axis
 */
export function formatChartDate(date: string | Date, format: 'short' | 'medium' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'medium':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    case 'long':
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    default:
      return d.toLocaleDateString();
  }
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Generate gradient color for charts
 */
export function generateGradient(
  ctx: CanvasRenderingContext2D,
  color: string,
  height: number
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, `${color}00`); // Transparent version
  return gradient;
}

/**
 * Aggregate data by time period
 */
export function aggregateByPeriod<T extends { date: string | Date; value: number }>(
  data: T[],
  period: 'day' | 'week' | 'month' | 'year'
): Array<{ date: string; value: number }> {
  const grouped = new Map<string, number>();

  data.forEach((item) => {
    const date = typeof item.date === 'string' ? new Date(item.date) : item.date;
    let key: string;

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString();
    }

    grouped.set(key, (grouped.get(key) || 0) + item.value);
  });

  return Array.from(grouped.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(data: number[], window: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const subset = data.slice(start, i + 1);
    const average = subset.reduce((sum, val) => sum + val, 0) / subset.length;
    result.push(average);
  }

  return result;
}

/**
 * Find min and max values in dataset
 */
export function findDataRange(data: number[]): { min: number; max: number } {
  if (data.length === 0) return { min: 0, max: 0 };

  return {
    min: Math.min(...data),
    max: Math.max(...data),
  };
}

/**
 * Round to nice chart values (e.g., 0, 25, 50, 75, 100)
 */
export function roundToNiceNumber(value: number, roundUp: boolean = true): number {
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const fraction = value / Math.pow(10, exponent);

  let niceFraction: number;
  if (roundUp) {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}

/**
 * Get responsive chart height based on container width
 */
export function getResponsiveChartHeight(width: number): number {
  if (width < 400) return 200;
  if (width < 768) return 250;
  if (width < 1024) return 300;
  return 350;
}
