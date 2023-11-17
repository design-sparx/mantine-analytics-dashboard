"use client"

import {ActionIcon, Affix, AppShell, Box, Container, rem, useMantineTheme,} from '@mantine/core';
import React, {useState} from 'react';
import Navigation from "@/layout/App/Navigation/Navigation";
import HeaderNav from "@/layout/App/HeaderNav/HeaderNav";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {ThemeDrawer} from "@/components";
import FooterNav from "@/layout/App/FooterNav/FooterNav";
import {IconPaint} from "@tabler/icons-react";

type Props = {
  children: React.ReactNode;
};

function AppLayout({children}: Props) {
  const [opened, setOpened] = useState(false);
  const [themeOpened, {open: themeOpen, close: themeClose}] = useDisclosure(false);
  const theme = useMantineTheme()
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, {toggle: toggleMobile}] = useDisclosure();
  const [desktopOpened, {toggle: toggleDesktop}] = useDisclosure(true);

  return (
    <AppShell
      layout="alt"
      header={{height: 60}}
      footer={{height: 60}}
      navbar={{width: 300, breakpoint: 'md', collapsed: {mobile: !mobileOpened, desktop: !desktopOpened}}}
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
        <Navigation onClose={() => setOpened(false)}/>
      </AppShell.Navbar>
      <AppShell.Main>
        <Box my="lg" mx="md">
          {children}
        </Box>
        <Affix position={{bottom: rem(48), right: rem(40)}} style={{zIndex: 100}}>
          <ActionIcon
            size={56}
            onClick={themeOpen}
            variant="default"
            radius="50%"
            style={{boxShadow: theme.shadows.xl}}
          >
            <IconPaint size={24}/>
          </ActionIcon>
        </Affix>
        <ThemeDrawer
          opened={themeOpened}
          onClose={themeClose}
        />
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Container fluid px="lg">
          <FooterNav/>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}

export default AppLayout;
