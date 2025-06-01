'use client';

import { ReactNode } from 'react';

import { MainLayout } from '@/layouts/Main';
import { Providers } from '@/providers/session';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  return (
    <MainLayout>
      <Providers>{children}</Providers>
    </MainLayout>
  );
}

export default AuthLayout;
