// app/api/projects/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5080/api/projects', {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add any needed credentials or headers here
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    );
  }
}
