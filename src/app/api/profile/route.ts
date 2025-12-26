import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'UserProfile.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const profile = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: profile,
        errors: [],
        message: 'Profile retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch profile'],
        message: 'Failed to fetch profile'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json(
      {
        succeeded: true,
        data: body,
        errors: [],
        message: 'Profile updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to update profile'],
        message: 'Failed to update profile'
      },
      { status: 500 }
    );
  }
}
