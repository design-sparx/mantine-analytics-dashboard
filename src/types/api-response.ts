/**
 * The single response envelope for every API route in this app.
 *
 * Both success and failure bodies are produced by the shared route helper, so
 * this type describes what routes actually return. Keep it in sync with that
 * helper rather than widening it independently.
 */
export interface IApiResponse<T> {
  /** Whether the request was handled successfully. */
  succeeded: boolean;
  /** Human-readable summary of the outcome. */
  message: string;
  /** ISO 8601 timestamp of when the response was produced. */
  timestamp: string;
  /** Response payload, or `null` when the request failed. */
  data: T | null;
  /** Failure details. Always present; empty on success. */
  errors: string[];
}
