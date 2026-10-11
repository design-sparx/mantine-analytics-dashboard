import { NextRequest } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';
import { apiFailure, apiSuccess } from '@/lib/api/mock-route';
import { validateWritePayload } from '@/lib/api/validation';

export async function GET() {
  return serveMock('UserProfile.json', 'Profile');
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateWritePayload('UserProfile', 'PUT', body);
    if (!validation.success) {
      return (
        validation.response ??
        apiFailure('Validation failed', validation.errors?.join(', '), 400)
      );
    }

    return apiSuccess(validation.data, 'Profile updated successfully');
  } catch (error) {
    console.error('API error:', error);
    return apiFailure(
      'Failed to update profile',
      'Failed to update profile',
      500,
    );
  }
}
