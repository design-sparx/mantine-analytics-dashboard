'use client';

import { ReactNode } from 'react';

import { MainLayout } from '@/layouts/Main';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}

export default AuthLayout;
