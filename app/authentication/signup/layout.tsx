'use client';

import { Center, Stack } from '@mantine/core';
import Image from 'next/image';
import React, { ReactNode } from 'react';

type AuthProps = {
  children: ReactNode;
};

function SignUpLayout({ children }: AuthProps) {
  return (
    <Center
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
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
  );
}

export default SignUpLayout;
