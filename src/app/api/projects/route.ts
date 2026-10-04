import { NextRequest, NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('Projects.json', 'Projects');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json(
      {
        succeeded: true,
        data: {
          id: `proj-${Date.now()}`,
          ...body,
          start_date: new Date().toLocaleDateString('en-US'),
        },
        errors: [],
        message: 'Project created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to create project'],
        message: 'Failed to create project',
      },
      { status: 500 },
    );
  }
}
