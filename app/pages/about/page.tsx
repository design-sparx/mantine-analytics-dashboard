'use client';

import { createElement } from 'react';

import {
  Anchor,
  Button,
  Container,
  Flex,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBrandGithub,
  IconBug,
  IconBulb,
  IconCode,
  IconExternalLink,
} from '@tabler/icons-react';

import { PageHeader, Surface } from '@/components';
import { PATH_DASHBOARD, PATH_GITHUB } from '@/routes';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Pages', href: '#' },
  { title: 'About', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const CARDS = [
  {
    title: 'GitHub',
    description: 'Source code of the website.',
    icon: IconBrandGithub,
    link: PATH_GITHUB.repo,
  },
  {
    title: 'Report Bug',
    description: 'Something not working? Report a bug',
    icon: IconBug,
    link: PATH_GITHUB.repo + '/issues/new/choose',
  },
  {
    title: 'Request Feature',
    description: 'Need something? Request a new feature.',
    icon: IconBulb,
    link: PATH_GITHUB.repo + '/issues/new/choose',
  },
  {
    title: 'Contribute',
    description: 'Contribute to this project.',
    icon: IconCode,
    link: PATH_GITHUB.repo + '/blob/main/CONTRIBUTING.md',
  },
];

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: {
    '&:hover': {
      color: 'red',
    },
  },
};

function Pricing() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <>
        <title>About | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="About" breadcrumbItems={items} />
          <Surface component={Paper} {...PAPER_PROPS}>
            <Text mb="md">
              A free, open source, Next 14, React 18 admin dashboard template
              created using Mantine 7.
            </Text>
            <Button
              component="a"
              target="_blank"
              href={PATH_GITHUB.repo}
              variant="filled"
              leftSection={<IconBrandGithub size={16} />}
              rel="noopener noreferrer"
            >
              Give us a star
            </Button>
          </Surface>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {CARDS.map((s) => (
              <a
                key={`col-${s.title}`}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: colorScheme === 'dark' ? theme.white : theme.black,
                }}
              >
                <Surface component={Paper} {...PAPER_PROPS}>
                  <Stack gap="xs">
                    <Flex justify="space-between">
                      <ThemeIcon size="lg" variant="light">
                        {createElement(s.icon)}
                      </ThemeIcon>
                      <IconExternalLink size={18} />
                    </Flex>
                    <Title order={5}>{s.title}</Title>
                    <Text size="sm">{s.description}</Text>
                  </Stack>
                </Surface>
              </a>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default Pricing;
