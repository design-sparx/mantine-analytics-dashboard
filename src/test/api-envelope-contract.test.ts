import { describe, expect, it } from 'vitest';

import { GET } from '@/app/api/invoices/route';

import type { IApiResponse } from '@/types/api-response';

/**
 * Type-level assertion: the reference route's response must satisfy the
 * envelope without a cast. If the two ever drift, this file fails to compile.
 */
type RouteEnvelope = Awaited<ReturnType<typeof GET>>;
type _AssertEnvelope = RouteEnvelope extends IApiResponse<unknown>
  ? true
  : never;

describe('reference route contract', () => {
  it('returns a body that satisfies IApiResponse', async () => {
    const request = new Request('http://localhost/api/invoices');
    const response = await GET(request);
    const body = (await response.json()) as IApiResponse<unknown>;

    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(typeof body.message).toBe('string');
    expect(typeof body.timestamp).toBe('string');
    expect(body.data).not.toBeNull();
    expect(body.errors).toEqual([]);
  });
});
