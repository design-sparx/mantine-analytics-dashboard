import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'Products.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: products,
        errors: [],
        message: 'Products retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch products'],
        message: 'Failed to fetch products'
      },
      { status: 500 }
    );
  }
}
