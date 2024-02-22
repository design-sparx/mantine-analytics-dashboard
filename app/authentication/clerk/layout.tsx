'use client';

import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import { ReactNode, useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import AppMain from '@/components/AppMain';
import Navigation from '@/components/Navigation';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';

type Props = {
  children: ReactNode;
};

function ClerkLayout({ children }: Props) {
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
        <AppMain>{children}</AppMain>
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Container fluid px="lg">
          <FooterNav />
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}

export default ClerkLayout;
