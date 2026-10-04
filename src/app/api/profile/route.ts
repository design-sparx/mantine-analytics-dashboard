import { NextRequest, NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('UserProfile.json', 'Profile');
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json(
      {
        succeeded: true,
        data: body,
        errors: [],
        message: 'Profile updated successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to update profile'],
        message: 'Failed to update profile',
      },
      { status: 500 },
    );
  }
}
