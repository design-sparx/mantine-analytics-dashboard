import { NextRequest, NextResponse } from 'next/server';

import { apiSuccess, apiFailure } from '@/lib/api/mock-route';
import { getChangelogData } from '@/lib/changelog';

export async function GET(request: NextRequest) {
  try {
    const { changelog, error } = await getChangelogData();

    if (error) {
      return apiFailure(error, undefined, 500);
    }

    return apiSuccess({ changelog }, 'Changelog retrieved successfully');
  } catch (error) {
    console.error('API error:', error);
    return apiFailure('Failed to fetch changelog data', undefined, 500);
  }
}
