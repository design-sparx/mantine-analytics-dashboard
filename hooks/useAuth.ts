'use client';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import {
  registerUser,
  forgotPassword as forgotPasswordUtil,
  resetPassword as resetPasswordUtil,
  changePassword as changePasswordUtil,
  updateProfile as updateProfileUtil,
  getProfile as getProfileUtil,
} from '@/utils/auth';
import {
  RegisterRequestDto,
  ResetPasswordRequestDto,
  ChangePasswordRequestDto,
  UpdateProfileDto,
  LogoutAuthRequestDto,
} from '@/types/user';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // Keep the NextAuth logout flow but also call backend logout
  const logout = async () => {
    try {
      // Call backend logout endpoint if user email is available
      if (session?.user?.email) {
        const logoutData: LogoutAuthRequestDto = {
          email: session.user.email,
        };

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(logoutData),
        });
      }
    } catch (error) {
      console.error('Backend logout failed:', error);
    } finally {
      await signOut({ redirect: false });
      router.push(PATH_AUTH.signin);
    }
  };

  // Keep the NextAuth login flow
  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push(PATH_DASHBOARD.default);
      return true;
    }

    return false;
  };

  // Additional auth methods using the utility functions
  const register = async (userData: RegisterRequestDto) => {
    try {
      await registerUser(userData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await forgotPasswordUtil(email);
      return true;
    } catch (error) {
      return false;
    }
  };

  const resetPassword = async (resetData: ResetPasswordRequestDto) => {
    try {
      await resetPasswordUtil(resetData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const changePassword = async (changePasswordData: ChangePasswordRequestDto) => {
    try {
      await changePasswordUtil(changePasswordData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateProfile = async (profileData: UpdateProfileDto) => {
    try {
      await updateProfileUtil(profileData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getProfile = async () => {
    try {
      return await getProfileUtil();
    } catch (error) {
      return null;
    }
  };

  return {
    user: session?.user,
    permissions: session?.permissions || [],
    roles: session?.roles || [],
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    getProfile,
    accessToken: session?.accessToken,
  };
};
