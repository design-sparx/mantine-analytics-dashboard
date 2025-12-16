import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'Invoices.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const invoices = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: invoices,
        errors: [],
        message: 'Invoices retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch invoices'],
        message: 'Failed to fetch invoices'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real app, you would save to database
    // For mock, just return success with the data
    return NextResponse.json(
      {
        succeeded: true,
        data: {
          id: `inv-${Date.now()}`,
          ...body,
          created: new Date().toISOString(),
        },
        errors: [],
        message: 'Invoice created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to create invoice'],
        message: 'Failed to create invoice'
      },
      { status: 500 }
    );
  }
}
