import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'ChatItems.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const messages = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: messages,
        errors: [],
        message: 'Chat messages retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch chat messages'],
        message: 'Failed to fetch chat messages'
      },
      { status: 500 }
    );
  }
}
