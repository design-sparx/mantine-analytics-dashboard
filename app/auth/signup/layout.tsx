'use client';

import { ReactNode } from 'react';

import { Box, Center, Stack } from '@mantine/core';
import Image from 'next/image';

import { SystemNotificationBanner } from '@/components';

type AuthProps = {
  children: ReactNode;
};

function SignUpLayout({ children }: AuthProps) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <SystemNotificationBanner layout="auth" />
      <Center style={{ flex: 1 }}>
        <Stack>
          <Center>
            <Image
              src="/logo-no-background.png"
              alt="DesignSparx logo"
              width={96}
              height={96}
              style={{ objectFit: 'contain' }}
            />
          </Center>
          {children}
        </Stack>
      </Center>
    </Box>
  );
}

export default SignUpLayout;
