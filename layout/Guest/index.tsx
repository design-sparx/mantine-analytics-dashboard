import { ReactNode } from 'react';
import {
  AppShell,
  Box,
  ColorSchemeScript,
  MantineProvider,
  useMantineTheme,
} from '@mantine/core';
import HeaderNav from '@/layout/Guest/HeaderNav/HeaderNav';
import FooterNav from '@/layout/Guest/FooterNav/FooterNav';
import { useHeadroom } from '@mantine/hooks';

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
