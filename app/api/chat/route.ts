import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'ChatsList.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const chats = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: chats,
        errors: [],
        message: 'Chats retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch chats'],
        message: 'Failed to fetch chats'
      },
      { status: 500 }
    );
  }
}
