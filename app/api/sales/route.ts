import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'Sales.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const sales = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: sales,
        errors: [],
        message: 'Sales data retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch sales data'],
        message: 'Failed to fetch sales data'
      },
      { status: 500 }
    );
  }
}
