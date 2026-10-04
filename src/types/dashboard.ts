/**
 * Hand-written dashboard payload types.
 *
 * `src/types/generated/fixtures.ts` covers every fixture whose payload is an
 * array. This file holds the two kinds it cannot generate:
 *
 * - payloads that are objects rather than arrays (`/api/stats`)
 * - types the UI genuinely needs to be narrower than the raw JSON
 *
 * Keep this list short. A type only belongs here when the data alone does not
 * describe it.
 */

/** One tile in the shared `StatsGrid`. */
export interface StatDto {
  title: string;
  value: string;
  diff: number;
  icon: string;
  /** Absent on the core `/api/stats` tiles; the grid falls back to a default. */
  color?: string;
  period?: string;
}

/**
 * `/api/stats` payload.
 *
 * Unlike the domain stats endpoints this one wraps its array in an object, so
 * the page unwraps `.data` once here rather than at every call site.
 */
export interface CoreStatsDto {
  data: StatDto[];
}
