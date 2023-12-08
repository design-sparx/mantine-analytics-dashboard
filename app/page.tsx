'use client';

import {
  Badge,
  Box,
  BoxProps,
  Button,
  Center,
  Container,
  ContainerProps,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  PaperProps,
  rem,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  ThemeIcon,
  ThemeIconProps,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { PATH_APPS, PATH_DASHBOARD, PATH_DOCS, PATH_GITHUB } from '@/routes';
import {
  IconAdjustmentsHorizontal,
  IconApps,
  IconArrowRight,
  IconBook,
  IconBrandGithub,
  IconBrandMantine,
  IconBrandTabler,
  IconColorSwatch,
  IconComponents,
  IconDevices,
  IconFileCode,
  IconFileCode2,
  IconFileInfo,
  IconFolderCode,
  IconLayoutBoard,
  IconLayoutGrid,
  IconPaint,
  IconPlayerPlay,
  IconScaleOutline,
  IconSettingsCog,
} from '@tabler/icons-react';
import CountUp from 'react-countup';
import { useMediaQuery } from '@mantine/hooks';
import GuestLayout from '@/layout/Guest';
import classes from './page.module.css';
import { createElement } from 'react';

const TECH_STACK = [
  { title: 'nextjs', version: '14.0.2', href: 'https://nextjs.org/' },
  { title: 'react', version: '18.2.0', href: 'https://react.dev/' },
  {
    title: 'typescript',
    version: '5.1.6',
    href: 'https://www.typescriptlang.org/',
  },
  { title: 'mantine', version: '7.2.2', href: 'https://mantine.dev/' },
  {
    title: 'tabler icons',
    version: '2.40.0',
    href: 'https://tabler-icons.io/',
  },
  { title: 'tiptap', version: '2.1.12', href: 'https://tiptap.dev/' },
  { title: 'apexcharts', version: '3.44.0', href: 'https://apexcharts.com/' },
  { title: 'dayjs', version: '1.11.10', href: 'https://day.js.org/' },
  { title: 'fullcalendar', version: '6.1.8', href: 'https://fullcalendar.io/' },
  {
    title: 'emotion',
    version: '11.11.1',
    href: 'https://emotion.sh/docs/introduction',
  },
  { title: 'dnd-kit', version: '6.0.8', href: 'https://dndkit.com/' },
  {
    title: 'embla-carousel',
    version: '8.0.0',
    href: 'https://www.embla-carousel.com/',
  },
  {
    title: 'mantine datatable',
    version: '7.1.7',
    href: 'https://icflorescu.github.io/mantine-datatable',
  },
  { title: 'lodash', version: '4.17.21', href: 'https://lodash.com/' },
  {
    title: 'react simple maps',
    version: '3.0.0',
    href: 'https://www.react-simple-maps.io/',
  },
];

const APPS = [
  {
    img: '/showcase/apps-calendar.png',
    title: 'calendar',
    link: PATH_APPS.calendar,
  },
  {
    img: '/showcase/apps-chat.png',
    title: 'chat',
    link: PATH_APPS.chat,
  },
  {
    img: '/showcase/apps-invoices.png',
    title: 'invoices',
    link: PATH_APPS.invoices.all,
  },
  {
    img: '/showcase/apps-orders.png',
    title: 'orders',
    link: PATH_APPS.orders,
  },
  {
    img: '/showcase/apps-profile.png',
    title: 'profile',
    link: PATH_APPS.profile,
  },
  {
    img: '/showcase/apps-projects.png',
    title: 'projects',
    link: PATH_APPS.projects,
  },
  {
    img: '/showcase/apps-settings.png',
    title: 'settings',
    link: PATH_APPS.settings,
  },
  {
    img: '/showcase/apps-tasks.png',
    title: 'tasks',
    link: PATH_APPS.tasks,
  },
];

const DASHBOARDS = [
  {
    img: '/showcase/dashboard-default.png',
    title: 'default',
    link: PATH_DASHBOARD.default,
  },
  {
    img: '/showcase/dashboard-analytics.png',
    title: 'analytics',
    link: PATH_DASHBOARD.analytics,
  },
  {
    img: '/showcase/dashboard-saas.png',
    title: 'saas',
    link: PATH_DASHBOARD.saas,
  },
  {
    img: '/showcase/dashboard-default-dark.png',
    title: 'dark mode',
    link: PATH_DASHBOARD.default,
  },
];

const FEATURES = [
  {
    title: '10+ Theme Colors',
    description:
      'We have included 6 pre-defined Theme Colors with Mantine Admin.',
    icons: IconPaint,
  },
  {
    title: '20+ Page Templates',
    description: 'Yes, we have 20+ in page demos.',
    icons: IconFileInfo,
  },
  {
    title: '45+ UI Components',
    description:
      'Almost 45+ UI Components being given with Mantine Admin Pack.',
    icons: IconComponents,
  },
  {
    title: '2+ Dashboards',
    description: 'Yes, we have designed 2 Stunning Dashboards.',
    icons: IconLayoutBoard,
  },
  {
    title: '11+ Applications',
    description:
      'Yes, we have designed 11 Applications which are ready to use.',
    icons: IconApps,
  },
  {
    title: 'Mantine UI',
    description: 'Its been made with Mantine UI and full responsive layout.',
    icons: IconBrandMantine,
  },
  {
    title: '4800+ Font Icons',
    description:
      'Lots of Icon Fonts are included here in the package of Mantine Admin.',
    icons: IconBrandTabler,
  },
  {
    title: 'Documentation',
    description: 'We have made detailed documentation, so it will easy to use.',
    icons: IconBook,
  },
  {
    title: 'Modular',
    description: 'All components are built to be used in any combination.',
    icons: IconFileCode,
  },
  {
    title: 'Responsive',
    description: 'Quick is optimized to work for most devices.',
    icons: IconDevices,
  },
  {
    title: 'Scalable',
    description: 'Remain consistent while developing new features.',
    icons: IconPaint,
  },
  {
    title: 'Customizable',
    description: 'Change a few variables and the whole theme adapts.',
    icons: IconAdjustmentsHorizontal,
  },
];

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  className: classes.paper,
};

const THEME_ICON_PROPS: Omit<ThemeIconProps, 'children'> = {
  variant: 'light',
  size: 48,
};

const IMAGE_PAPER_PROPS: PaperProps = {
  py: 'md',
  className: classes.paperImage,
};

export default function Home() {
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const BOX_PROPS: ContainerProps = {
    pt: rem(120),
    pb: rem(80),
    px: tablet_match ? rem(36) : rem(40 * 3),
    className: classes.section,
  };

  return (
    <>
      <>
        <title>DesignSparx | Website UI Kit</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </>
      <GuestLayout>
        <Box className={classes.hero}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
              <Stack>
                <Text>Build like a Pro</Text>
                <Title className={classes.title}>
                  The simplest and fastest way to build your next{' '}
                  <Text component="span" inherit className={classes.highlight}>
                    Mantine UI{' '}
                  </Text>
                  &{' '}
                  <Text component="span" inherit className={classes.highlight}>
                    Nextjs{' '}
                  </Text>
                  dashboard or app.
                </Title>
                <Text>
                  Mantine admin template comes with hundreds of UI elements,
                  forms, tables, charts, pages and icons that helps you to
                  create your web apps or applications faster.
                </Text>
                <Group my="lg">
                  <Button
                    component={Link}
                    href={PATH_DASHBOARD.default}
                    size="md"
                    leftSection={<IconPlayerPlay size={18} />}
                  >
                    Live Preview
                  </Button>
                  <Button
                    size="md"
                    component="a"
                    href={PATH_GITHUB.repo}
                    target="_blank"
                    variant="white"
                    leftSection={<IconBrandGithub size={18} />}
                  >
                    Give us a star
                  </Button>
                </Group>
                <Stack>
                  <Text fw={700}>Tech Stack:</Text>
                  <Spoiler
                    maxHeight={48}
                    showLabel="Show more"
                    hideLabel="Hide"
                    styles={{ control: { color: 'white', margin: '4px 8px' } }}
                  >
                    <Group pb="sm">
                      {TECH_STACK.map((t) => (
                        <Tooltip
                          key={t.title}
                          label={`${t.title}-${t.version}`}
                        >
                          <UnstyledButton
                            className={classes.stackControl}
                            component="a"
                            href={t.href}
                            target="_blank"
                          >
                            {t.title}
                          </UnstyledButton>
                        </Tooltip>
                      ))}
                    </Group>
                  </Spoiler>
                </Stack>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
              <Image
                src={
                  colorScheme === 'dark'
                    ? '/thumbnail-img.jpg'
                    : '/thumbnail-img-b.jpg'
                }
                alt="/"
                radius="md"
              />
            </Grid.Col>
          </Grid>
        </Box>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify={{ sm: 'space-evenly' }}
          align="center"
          px="lg"
          pt="xl"
          className={classes.section}
        >
          <Text>Created: July, 24 2023</Text>
          <Text>Updated: December, 8 2023</Text>
          <Text>v 2.0</Text>
          <Text
            component="a"
            target="_blank"
            href="https://github.com/design-sparx/mantine-analytics-dashboard/releases"
          >
            View changelog
          </Text>
        </Flex>
        <Container fluid {...BOX_PROPS}>
          <Title order={2} ta="center" mb="xl">
            Carefully crafted pages ready to use in your project
          </Title>
          <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
            spacing={{ base: 'sm', sm: 'sm', md: 'sm', lg: 'lg' }}
            verticalSpacing={{ base: 'sm', sm: 'sm', md: 'sm', lg: 'lg' }}
          >
            {DASHBOARDS.map((dashboard) => (
              <Paper
                key={dashboard.title}
                component={Link}
                href={dashboard.link}
                {...IMAGE_PAPER_PROPS}
              >
                <Image
                  src={dashboard.img}
                  alt={dashboard.title}
                  className={classes.image}
                />
                <Text mt="md" ta="center" tt="capitalize" fz="lg">
                  {dashboard.title}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
        <Container fluid {...BOX_PROPS}>
          <Title order={2} ta="center" mb="xl">
            {APPS.length - 2}+ apps included
          </Title>
          <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
            spacing={{ base: 'sm', sm: 'sm', md: 'sm', lg: 'lg' }}
            verticalSpacing={{ base: 'sm', sm: 'sm', md: 'sm', lg: 'lg' }}
          >
            {APPS.map((app) => (
              <Paper
                key={app.title}
                component={Link}
                href={app.link}
                {...IMAGE_PAPER_PROPS}
              >
                <Image
                  src={app.img}
                  alt={app.title}
                  className={classes.image}
                />
                <Text mt="md" ta="center" tt="capitalize" fz="lg">
                  {app.title}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
        <Container fluid {...BOX_PROPS}>
          <Title order={2} ta="center" mb="xl">
            Mantine admin helps you build beautiful websites that stand out and
            automatically adapt to your style.
          </Title>
          <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
            spacing={{ base: 'sm', sm: 'sm', md: 'sm', lg: 'lg' }}
            verticalSpacing={{ base: 'sm', sm: 'sm', md: 'sm', lg: 'lg' }}
          >
            {FEATURES.map((feature) => (
              <Paper
                key={feature.title}
                p="md"
                withBorder
                className={classes.featureCard}
              >
                <Flex gap="md">
                  <ThemeIcon size="xl" radius="xl" variant="light">
                    {createElement(feature.icons, { style: { fontSize: 20 } })}
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Title order={4}>{feature.title}</Title>
                    <Text fz="md">{feature.description}</Text>
                  </Stack>
                </Flex>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
        <Box {...BOX_PROPS}>
          <Paper className={classes.contactPaper}>
            <Title order={3} mb="md">
              For any queries?
            </Title>
            <Button
              variant="subtle"
              rightSection={<IconArrowRight size={16} />}
            >
              Contact Us
            </Button>
          </Paper>
        </Box>
      </GuestLayout>
    </>
  );
}
