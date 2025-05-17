import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add the authorization header if it exists
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/api/product-categories',
      {
        method: 'GET',
        headers,
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product categories' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add the authorization header if it exists
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/api/product-categories',
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create product category', details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product category' },
      { status: 500 },
    );
  }
}
