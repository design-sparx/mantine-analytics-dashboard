import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/api/projects',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // Add any needed credentials or headers here
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/api/projects',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create project', details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 },
    );
  }
}
