import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`,
      {
        method: 'GET',
        headers,
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update product', details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`,
      {
        method: 'DELETE',
        headers,
      },
    );

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { error: 'Failed to delete product', details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}
