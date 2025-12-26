import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'Orders.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const orders = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: orders,
        errors: [],
        message: 'Orders retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch orders'],
        message: 'Failed to fetch orders'
      },
      { status: 500 }
    );
  }
}
