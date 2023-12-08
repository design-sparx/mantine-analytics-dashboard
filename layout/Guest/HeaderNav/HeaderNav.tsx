import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  rem,
  ScrollArea,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { PATH_DASHBOARD, PATH_DOCS, PATH_GITHUB } from '@/routes';
import { Logo } from '@/components';
import Link from 'next/link';
import classes from './HeaderNav.module.css';
import { IconBrandGithub, IconPlayerPlay } from '@tabler/icons-react';

const MOCK_DATA = [
  {
    link: 'https://652579e5b7998a00083d022b--mantine-analytics-dashboard.netlify.app/',
    label: 'Version 1',
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

  const items = MOCK_DATA.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        target="_blank"
        className={classes.link}
      >
        {link.label}
      </a>
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
              variant="default"
              leftSection={<IconBrandGithub size={16} />}
            >
              Star this project
            </Button>
            <Button
              component={Link}
              href={PATH_DASHBOARD.default}
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
          <iframe
            src="https://ghbtns.com/github-btn.html?user=design-sparx&repo=mantine-analytics-dashboard&type=star&count=true&size=large"
            frameBorder="0"
            scrolling="0"
            width="140"
            height="30"
            title="GitHub"
          />
          <Button component={Link} href={PATH_DASHBOARD.default}>
            Live Previews
          </Button>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default HeaderNav;
