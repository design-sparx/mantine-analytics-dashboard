import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'Emails.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const emails = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: emails,
        errors: [],
        message: 'Emails retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch emails'],
        message: 'Failed to fetch emails'
      },
      { status: 500 }
    );
  }
}
