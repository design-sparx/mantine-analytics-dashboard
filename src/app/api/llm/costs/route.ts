import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'cost-analysis.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    return NextResponse.json({
      succeeded: true,
      data,
      errors: [],
      message: 'Cost analysis retrieved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch cost analysis'],
        message: 'Error retrieving data',
      },
      { status: 500 }
    );
  }
}
