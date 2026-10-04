import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

import type { IApiResponse } from '@/types/api-response';

/**
 * Root directory holding the JSON fixtures that back the mock API.
 */
const MOCKS_DIR = path.join(process.cwd(), 'public', 'mocks');

/**
 * Builds a success envelope. Exported so write routes added later can reuse it.
 */
export function apiSuccess<T>(
  data: T,
  message: string,
  status = 200,
): NextResponse<IApiResponse<T>> {
  return NextResponse.json<IApiResponse<T>>(
    {
      succeeded: true,
      data,
      errors: [],
      message,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

/**
 * Builds the standard failure envelope. The caller supplies the message and the
 * error string so neither can leak an internal detail by accident.
 */
export function apiFailure(
  message: string,
  error: string,
  status = 500,
): NextResponse<IApiResponse<never>> {
  return NextResponse.json<IApiResponse<never>>(
    {
      succeeded: false,
      data: null,
      errors: [error],
      message,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

/**
 * Reads a mock JSON fixture and returns it in the standard success envelope.
 *
 * `resource` is a human-readable label for whatever the route serves. Messages
 * are derived from it so the message and the fixture can never drift apart.
 *
 * A missing or malformed fixture resolves to the standard failure envelope
 * rather than throwing, so a route body stays a single expression.
 */
export async function serveMock<T>(
  fixture: string,
  resource: string,
): Promise<NextResponse<IApiResponse<T>>> {
  try {
    const filePath = path.join(MOCKS_DIR, fixture);
    const contents = await fs.promises.readFile(filePath, 'utf8');

    return apiSuccess<T>(
      JSON.parse(contents) as T,
      `${resource} retrieved successfully`,
    );
  } catch (error) {
    // Log the cause server-side only. The resolved file path is never included
    // in the response body.
    console.error(`[api] failed to serve ${resource} from ${fixture}:`, error);

    return apiFailure(
      `Failed to fetch ${resource}`,
      `Failed to fetch ${resource}`,
    );
  }
}
