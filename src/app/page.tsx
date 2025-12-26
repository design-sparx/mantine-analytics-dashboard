'use client';

import { createElement } from 'react';

import {
  Box,
  Button,
  Container,
  ContainerProps,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  PaperProps,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
  rem,
  useMantineColorScheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconArrowRight,
  IconBrandGithub,
  IconPlayerPlay,
} from '@tabler/icons-react';
import Link from 'next/link';

import { HOME_APPS } from '@/constants/home-apps';
import { HOME_DASHBOARDS } from '@/constants/home-dashboard';
import { HOME_FEATURES } from '@/constants/home-features';
import { TECH_STACK } from '@/constants/tech-stack';
import GuestLayout from '@/layouts/Guest';
import { PATH_AUTH, PATH_GITHUB } from '@/routes';

import classes from './page.module.css';

const IMAGE_PAPER_PROPS: PaperProps = {
  py: 'md',
  className: classes.paperImage,
};

export default function Home() {
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const { colorScheme } = useMantineColorScheme();

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
                <Text fz="lg">
                  Mantine admin template comes with hundreds of UI elements,
                  forms, tables, charts, pages and icons that helps you to
                  create your web apps or applications faster.
                </Text>
                <Group my="lg">
                  <Button
                    component={Link}
                    href={PATH_AUTH.signin}
                    size="lg"
                    leftSection={<IconPlayerPlay size={18} />}
                  >
                    Live Preview
                  </Button>
                  <Button
                    size="lg"
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
                    hideLabel="Show less"
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
          <Text>Created: June, 7 2025</Text>
          <Text>Updated: December, 8 2023</Text>
          <Text>v 3.0</Text>
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
            {HOME_DASHBOARDS.map((dashboard) => (
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
            {HOME_APPS.length - 2}+ apps included
          </Title>
          <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
            spacing={{ base: 'sm', sm: 'sm', md: 'sm', lg: 'lg' }}
            verticalSpacing={{ base: 'sm', sm: 'sm', md: 'sm', lg: 'lg' }}
          >
            {HOME_APPS.map((app) => (
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
            {HOME_FEATURES.map((feature) => (
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
