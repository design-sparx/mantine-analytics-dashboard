import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'hr-stats.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    return NextResponse.json({
      succeeded: true,
      data,
      errors: [],
      message: 'HR stats retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch HR stats'],
        message: 'Error retrieving data',
      },
      { status: 500 }
    );
  }
}
