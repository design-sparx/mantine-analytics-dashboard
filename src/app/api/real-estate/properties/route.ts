import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'property-listings.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    return NextResponse.json({
      succeeded: true,
      data,
      errors: [],
      message: 'Property listings retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch property listings'],
        message: 'Error retrieving data',
      },
      { status: 500 }
    );
  }
}
