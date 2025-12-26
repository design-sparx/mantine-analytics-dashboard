export interface IUserClaim {
  type: string | null;
  value: string | null;
}

export interface IUser {
  id: string | null;
  userName: string | null;
  email: string | null;
  phoneNumber: string | null;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  roles: string[];
  claims: IUserClaim[];
}

// New API DTOs based on shared API specification
export interface AuthRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  userId: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequestDto {
  token: string;
}

export interface LogoutAuthRequestDto {
  email: string;
}

export interface ChangePasswordRequestDto {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileDto {
  email?: string;
  phoneNumber?: string;
}

export interface ClaimDto {
  type?: string;
  value?: string;
}

export interface CreateUserDto {
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  roles?: string[];
  claims?: ClaimDto[];
}

export interface UpdateUserDto {
  email?: string;
  phoneNumber?: string;
  roles?: string[];
  claims?: ClaimDto[];
  lockoutEnabled?: boolean;
}

export interface ResetPasswordDto {
  userId: string;
  newPassword: string;
}
