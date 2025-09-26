import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/lib/authOptions';
import { PATH_AUTH } from '@/routes';
import {
  RegisterRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  ChangePasswordRequestDto,
  UpdateProfileDto,
} from '@/types/user';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(PATH_AUTH.signin);
  }

  return user;
}

// Additional auth utilities for the new API endpoints
export async function registerUser(userData: RegisterRequestDto) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function forgotPassword(email: string) {
  try {
    const forgotPasswordData: ForgotPasswordRequestDto = { email };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(forgotPasswordData),
    });

    if (!response.ok) {
      throw new Error('Forgot password request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

export async function resetPassword(resetData: ResetPasswordRequestDto) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    if (!response.ok) {
      throw new Error('Reset password failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

export async function changePassword(changePasswordData: ChangePasswordRequestDto) {
  try {
    const session = await getSession();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(changePasswordData),
    });

    if (!response.ok) {
      throw new Error('Change password failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
}

export async function updateProfile(profileData: UpdateProfileDto) {
  try {
    const session = await getSession();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Update profile failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}

export async function getProfile() {
  try {
    const session = await getSession();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Get profile failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}
