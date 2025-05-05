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
