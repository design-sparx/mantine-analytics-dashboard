'use client';

import { ReactNode } from 'react';

import { AppShell, Box, useMantineTheme } from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';

import HeaderNav from './HeaderNav/HeaderNav';
import FooterNav from '../Main/components/Footer';

type GuestLayoutProps = {
  children: ReactNode;
};

function GuestLayout({ children }: GuestLayoutProps) {
  const theme = useMantineTheme();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <>
      <AppShell header={{ height: 60, collapsed: !pinned, offset: false }}>
        <AppShell.Header>
          <HeaderNav />
        </AppShell.Header>
        <AppShell.Main>
          <Box style={{ backgroundColor: theme.colors.gray[0] }}>
            {children}
          </Box>
          <FooterNav />
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default GuestLayout;
