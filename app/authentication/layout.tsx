'use client';

import { ReactNode } from 'react';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  return <>{children}</>;
}

export default AuthLayout;
