import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'Notifications.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const notifications = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: notifications,
        errors: [],
        message: 'Notifications retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch notifications'],
        message: 'Failed to fetch notifications'
      },
      { status: 500 }
    );
  }
}
