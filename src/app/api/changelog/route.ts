import { NextRequest, NextResponse } from 'next/server';

import { getChangelogData } from '@/lib/changelog';

export async function GET(request: NextRequest) {
  try {
    const { changelog, error } = await getChangelogData();

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      { changelog },
      {
        status: 200,
        headers: {
          // Cache for 1 hour
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch changelog data' },
      { status: 500 },
    );
  }
}
