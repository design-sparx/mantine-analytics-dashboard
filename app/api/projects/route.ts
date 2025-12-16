import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'mocks', 'Projects.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(fileContents);

    return NextResponse.json(
      {
        succeeded: true,
        data: projects,
        errors: [],
        message: 'Projects retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to fetch projects'],
        message: 'Failed to fetch projects'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json(
      {
        succeeded: true,
        data: {
          id: `proj-${Date.now()}`,
          ...body,
          start_date: new Date().toLocaleDateString('en-US'),
        },
        errors: [],
        message: 'Project created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        succeeded: false,
        data: null,
        errors: ['Failed to create project'],
        message: 'Failed to create project'
      },
      { status: 500 }
    );
  }
}
