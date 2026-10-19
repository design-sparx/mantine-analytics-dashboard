import { NextRequest } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';
import { apiFailure, apiSuccess } from '@/lib/api/mock-route';
import { validateWritePayload } from '@/lib/api/validation';

export async function GET() {
  return serveMock('Projects.json', 'Projects');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateWritePayload('Projects', 'POST', body);
    if (!validation.success) {
      return (
        validation.response ??
        apiFailure('Validation failed', validation.errors?.join(', '), 400)
      );
    }

    const record = {
      id: `proj-${Date.now()}`,
      ...validation.data,
      start_date: new Date().toLocaleDateString('en-US'),
    };

    return apiSuccess(record, 'Project created successfully', 201);
  } catch (error) {
    console.error('API error:', error);
    return apiFailure(
      'Failed to create project',
      'Failed to create project',
      500,
    );
  }
}
