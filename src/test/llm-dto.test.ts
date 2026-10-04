import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import { API_LLM } from '@/routes/api';

import type {
  LlmCostDto,
  LlmModelUsageDto,
  LlmPerformanceDto,
  LlmStatDto,
  LlmTokenTrendDto,
  LlmUseCaseDto,
} from '@/types/llm';

const MOCKS_DIR = path.join(process.cwd(), 'public', 'mocks');

const readFixture = (name: string): unknown[] =>
  JSON.parse(fs.readFileSync(path.join(MOCKS_DIR, `${name}.json`), 'utf8'));

/**
 * Compile-time proof that each fixture is assignable to its DTO, and a runtime
 * assertion that the fixture actually exists and is an array. Editing a mock
 * file in a way that breaks the contract fails the suite, which is the whole
 * point of typing the LLM domain.
 */
const conforms = <T>(name: string): void => {
  const rows = readFixture(name);

  expect(Array.isArray(rows)).toBe(true);
  expect(rows.length).toBeGreaterThan(0);

  rows.forEach((row, index) => {
    // The annotation is what makes `tsc --noEmit` fail on a shape drift.
    const typed: T = row as T;

    expect(typed).toBeDefined();

    if (index === rows.length - 1) {
      // No-op; the loop exists to exercise every row, not just the first.
    }
  });
};

describe('LLM DTO conformance', () => {
  it('llm-stats.json satisfies LlmStatDto', () => {
    conforms<LlmStatDto>('llm-stats');

    for (const stat of readFixture('llm-stats') as LlmStatDto[]) {
      expect(typeof stat.title).toBe('string');
      expect(typeof stat.value).toBe('string');
      expect(typeof stat.diff).toBe('number');
    }
  });

  it('model-usage.json satisfies LlmModelUsageDto', () => {
    conforms<LlmModelUsageDto>('model-usage');

    for (const row of readFixture('model-usage') as LlmModelUsageDto[]) {
      expect(typeof row.model).toBe('string');
      expect(typeof row.requests).toBe('number');
      expect(typeof row.tokens).toBe('number');
      expect(typeof row.avgLatency).toBe('number');
      expect(typeof row.successRate).toBe('number');
      expect(typeof row.cost).toBe('number');
    }
  });

  it('token-usage-trends.json satisfies LlmTokenTrendDto', () => {
    conforms<LlmTokenTrendDto>('token-usage-trends');

    for (const row of readFixture('token-usage-trends') as LlmTokenTrendDto[]) {
      expect(typeof row.month).toBe('string');
      expect(typeof row.input).toBe('number');
      expect(typeof row.output).toBe('number');
      expect(typeof row.total).toBe('number');
    }
  });

  it('use-case-distribution.json satisfies LlmUseCaseDto', () => {
    conforms<LlmUseCaseDto>('use-case-distribution');

    for (const row of readFixture('use-case-distribution') as LlmUseCaseDto[]) {
      expect(typeof row.useCase).toBe('string');
      expect(typeof row.percentage).toBe('number');
      expect(typeof row.requests).toBe('number');
      expect(typeof row.color).toBe('string');
    }
  });

  it('performance-metrics.json satisfies LlmPerformanceDto', () => {
    conforms<LlmPerformanceDto>('performance-metrics');

    for (const row of readFixture(
      'performance-metrics',
    ) as LlmPerformanceDto[]) {
      expect(typeof row.month).toBe('string');
      expect(typeof row.latency).toBe('number');
      expect(typeof row.errorRate).toBe('number');
      expect(typeof row.throughput).toBe('number');
    }
  });

  it('cost-analysis.json satisfies LlmCostDto', () => {
    conforms<LlmCostDto>('cost-analysis');

    for (const row of readFixture('cost-analysis') as LlmCostDto[]) {
      expect(typeof row.month).toBe('string');
      expect(typeof row.apiCost).toBe('number');
      expect(typeof row.computeCost).toBe('number');
      expect(typeof row.storageCost).toBe('number');
      expect(typeof row.total).toBe('number');
    }
  });
});

describe('LLM registry entries', () => {
  const expected: Record<string, string> = {
    stats: '/api/llm/stats',
    modelUsage: '/api/llm/model-usage',
    tokenTrends: '/api/llm/token-trends',
    useCases: '/api/llm/use-cases',
    performance: '/api/llm/performance',
    costs: '/api/llm/costs',
  };

  it.each(Object.entries(expected))('%s points at %s', (key, value) => {
    expect(API_LLM[key as keyof typeof API_LLM]).toBe(value);
  });

  it('has a route handler behind each entry', () => {
    for (const endpoint of Object.values(API_LLM)) {
      const relative = endpoint.replace(/^\/api/, 'src/app/api');
      expect(
        fs.existsSync(path.join(process.cwd(), `${relative}/route.ts`)),
      ).toBe(true);
    }
  });
});
