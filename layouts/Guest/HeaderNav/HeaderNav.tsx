import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  ScrollArea,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconBrandGithub, IconPlayerPlay } from '@tabler/icons-react';
import Link from 'next/link';

import { Logo } from '@/components';
import { PATH_AUTH, PATH_DASHBOARD, PATH_DOCS, PATH_GITHUB } from '@/routes';

import classes from './HeaderNav.module.css';

const LINK_ITEMS = [
  {
    link: '/changelog',
    label: 'changelog',
  },
  {
    link: 'https://github.com/orgs/design-sparx/projects/5',
    label: 'roadmap',
  },
  {
    link: 'https://6564d1b09deea091e3ec0769-jsxuvbmjcr.chromatic.com/?path=/docs/welcome--docs',
    label: 'components',
  },
  {
    link: 'mailto:kelvin.kiprop96@gmail.com',
    label: 'support',
  },
  {
    link: PATH_DOCS.root,
    label: 'documentation',
  },
];

const HEADER_HEIGHT = rem(60);

const HeaderNav = () => {
  const theme = useMantineTheme();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const items = LINK_ITEMS.map((link) => {
    return (
      <Button
        key={link.label}
        component="a"
        href={link.link}
        target="_blank"
        variant="transparent"
        c="white"
        className={classes.link}
      >
        {link.label}
      </Button>
    );
  });

  return (
    <Box>
      <header className={classes.header}>
        <Container className={classes.inner} fluid>
          <Logo style={{ color: theme.white }} />
          <Group gap="xs" className={classes.links}>
            {items}
            <Button
              component="a"
              target="_blank"
              href={PATH_GITHUB.repo}
              variant="transparent"
              c="white"
              leftSection={<IconBrandGithub size={16} />}
              className={classes.link}
            >
              Give us a star
            </Button>
            <Button
              component={Link}
              href={PATH_AUTH.signin}
              leftSection={<IconPlayerPlay size={16} />}
            >
              Live Preview
            </Button>
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
            color={theme.white}
          />
        </Container>
      </header>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Menu"
        className={classes.hiddenDesktop}
        zIndex={1000000}
        transitionProps={{
          transition: tablet_match ? 'slide-up' : 'slide-left',
        }}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          {items}
          <Button
            component="a"
            target="_blank"
            href={PATH_GITHUB.repo}
            variant="transparent"
            c="white"
            leftSection={<IconBrandGithub size={16} />}
            className={classes.link}
          >
            Give us a star
          </Button>
          <Button component={Link} href={PATH_DASHBOARD.default}>
            Live Previews
          </Button>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default HeaderNav;
