/**
 * Data transfer objects for the LLM/AI dashboard.
 *
 * These mirror the shape of the fixtures behind each endpoint:
 *
 * | Endpoint            | Fixture                     | DTO                    |
 * | ------------------- | --------------------------- | ---------------------- |
 * | `/api/llm/stats`    | `llm-stats.json`            | `LlmStatDto`           |
 * | `/api/llm/model-usage`   | `model-usage.json`          | `LlmModelUsageDto`     |
 * | `/api/llm/token-trends`  | `token-usage-trends.json`   | `LlmTokenTrendDto`     |
 * | `/api/llm/use-cases`     | `use-case-distribution.json`| `LlmUseCaseDto`        |
 * | `/api/llm/performance`   | `performance-metrics.json`  | `LlmPerformanceDto`    |
 * | `/api/llm/costs`         | `cost-analysis.json`        | `LlmCostDto`           |
 *
 * `src/test/llm-dto.test.ts` asserts each fixture is assignable to its DTO, so
 * editing a mock file in a way that breaks this contract fails the suite.
 */

/** One headline figure in the LLM stats grid. */
export interface LlmStatDto {
  title: string;
  value: string;
  diff: number;
  icon: string;
  color: string;
  period?: string;
}

/** Per-model request, token, latency and cost figures. */
export interface LlmModelUsageDto {
  model: string;
  requests: number;
  tokens: number;
  avgLatency: number;
  successRate: number;
  cost: number;
}

/** Monthly input/output token counts. */
export interface LlmTokenTrendDto {
  month: string;
  input: number;
  output: number;
  total: number;
}

/** Share of traffic attributable to a use case. */
export interface LlmUseCaseDto {
  useCase: string;
  percentage: number;
  requests: number;
  color: string;
}

/** Monthly latency, error rate and throughput. */
export interface LlmPerformanceDto {
  month: string;
  latency: number;
  errorRate: number;
  throughput: number;
}

/** Monthly cost broken down by source. */
export interface LlmCostDto {
  month: string;
  apiCost: number;
  computeCost: number;
  storageCost: number;
  total: number;
}
