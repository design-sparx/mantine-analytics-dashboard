'use client';

import { ReactNode } from 'react';

import { ClerkProvider } from '@clerk/nextjs';

import { MainLayout } from '@/layouts/Main';
import { Providers } from '@/providers/session';

import './layout.css';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  return (
    <MainLayout>
      <Providers>
        <ClerkProvider
          appearance={{
            cssLayerName: 'clerk',
          }}
        >
          {children}
        </ClerkProvider>
      </Providers>
    </MainLayout>
  );
}

export default AuthLayout;
