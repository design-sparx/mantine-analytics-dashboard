'use client';

import { ReactNode } from 'react';

import { ClerkProvider } from '@clerk/nextjs';
import { Alert, Container, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { MainLayout } from '@/layouts/Main';

import './layout.css';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  // Check if Clerk is configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return (
      <MainLayout>
        <Container size="sm" py="xl">
          <Stack>
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Clerk Not Configured"
              color="yellow"
            >
              <Text size="sm">
                Clerk authentication is not configured. Please set the{' '}
                <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> environment
                variable to enable Clerk features.
              </Text>
            </Alert>
            <Title order={4}>To configure Clerk:</Title>
            <Text size="sm">
              1. Create an account at{' '}
              <a
                href="https://dashboard.clerk.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                dashboard.clerk.com
              </a>
            </Text>
            <Text size="sm">
              2. Get your publishable key from the API Keys section
            </Text>
            <Text size="sm">
              3. Add it to your <code>.env.local</code> file
            </Text>
          </Stack>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ClerkProvider
        appearance={{
          cssLayerName: 'clerk',
        }}
      >
        {children}
      </ClerkProvider>
    </MainLayout>
  );
}

export default AuthLayout;
