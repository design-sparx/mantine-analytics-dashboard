import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'Traffic.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const traffic = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: traffic,
        errors: [],
        message: 'Traffic data retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch traffic data'],
        message: 'Failed to fetch traffic data'
      },
      { status: 500 }
    );
  }
}
