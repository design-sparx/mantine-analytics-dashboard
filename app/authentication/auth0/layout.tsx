'use client';

import { ReactNode, useState } from 'react';
import { Providers } from '@/providers/session';
import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import HeaderNav from '@/components/HeaderNav';
import Navigation from '@/components/Navigation';
import AppMain from '@/components/AppMain';
import FooterNav from '@/components/FooterNav';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

type Auth0LayoutProps = {
  children: ReactNode;
};

export default function Auth0Layout({ children }: Auth0LayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [themeOpened, { open: themeOpen, close: themeClose }] =
    useDisclosure(false);
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding={0}
    >
      <AppShell.Header
        style={{
          height: rem(60),
          border: 'none',
          boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
        }}
      >
        <Container fluid py="sm" px="lg">
          <HeaderNav
            opened={opened}
            handleOpen={() => setOpened((o) => !o)}
            desktopOpened={desktopOpened}
            mobileOpened={mobileOpened}
            toggleDesktop={toggleDesktop}
            toggleMobile={toggleMobile}
          />
        </Container>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation onClose={() => setOpened(false)} />
      </AppShell.Navbar>
      <AppShell.Main>
        <AppMain>
          <Providers>{children}</Providers>
        </AppMain>
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Container fluid px="lg">
          <FooterNav />
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}
