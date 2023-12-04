'use client';

import {
  Anchor,
  Container,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { PATH_DASHBOARD } from '@/routes';
import { PageHeader, Surface } from '@/components';
import { Metadata } from 'next';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Pages', href: '#' },
  { title: 'Blank', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Pricing() {
  return (
    <>
      <>
        <title>Blank page | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container>
        <Stack gap="lg">
          <PageHeader title="Blank page" breadcrumbItems={items} />
          <Surface component={Paper} {...PAPER_PROPS}>
            <Text size="lg" fw={600} mb="xl">
              Empty card header
            </Text>
            <Text>Empty card text</Text>
          </Surface>
        </Stack>
      </Container>
    </>
  );
}

export default Pricing;
