import { NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('FileActivities.json', 'FileActivities');
}
