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
 * Builds the standard failure envelope.
 *
 * `error` defaults to `message` because most failures need only say the one
 * thing. Supply it only when the failure carries extra detail worth surfacing,
 * and keep that detail as free of internal specifics as the message is.
 */
export function apiFailure(
  message: string,
  error: string = message,
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
 * `fixture` is always a literal at the call site, but it is still resolved
 * against the fixtures root and rejected if it escapes that directory, so a
 * computed name can never pull in a file from outside `public/mocks`.
 *
 * A missing or malformed fixture resolves to the standard failure envelope
 * rather than throwing, so a route body stays a single expression.
 */
export async function serveMock<T>(
  fixture: string,
  resource: string,
): Promise<NextResponse<IApiResponse<T>>> {
  try {
    const filePath = path.resolve(MOCKS_DIR, fixture);
    const relative = path.relative(MOCKS_DIR, filePath);

    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new Error(`Refusing to read "${fixture}" outside the mocks root`);
    }

    const contents = await fs.promises.readFile(filePath, 'utf8');

    return apiSuccess<T>(
      JSON.parse(contents) as T,
      `${resource} retrieved successfully`,
    );
  } catch (error) {
    // Log the cause server-side only. The resolved file path is never included
    // in the response body.
    console.error(`[api] failed to serve ${resource} from ${fixture}:`, error);

    return apiFailure(`Failed to fetch ${resource}`);
  }
}
