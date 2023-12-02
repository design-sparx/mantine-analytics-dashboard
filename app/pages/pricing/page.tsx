'use client';

import React, { useState } from 'react';
import {
  Anchor,
  Button,
  Container,
  Flex,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { PATH_DASHBOARD } from '@/routes';
import { Faqs, PageHeader, PricingCard, Surface } from '@/components';
import { IconChevronRight } from '@tabler/icons-react';
import { Metadata } from 'next';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Pages', href: '#' },
  { title: 'Pricing', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

const PRICING = [
  {
    tier: 'basic',
    price: {
      month: 0,
      year: 0,
    },
    features: ['Rich landing pages', '100+ components'],
    preferred: false,
    actionText: 'start for free',
    description: 'All the basics for starting a new business',
  },
  {
    tier: 'standard',
    price: {
      month: 25,
      year: 45,
    },
    features: [
      'Rich landing pages',
      '100+ components',
      'Flexible licensing',
      'Speedy build tooling',
      '6 months free support',
    ],
    preferred: true,
    actionText: 'start with standard',
    description: 'Everything you need for a growing business',
  },
  {
    tier: 'premium',
    price: {
      month: 40,
      year: 70,
    },
    features: [
      'Rich landing pages',
      '100+ components',
      'Flexible licensing',
      'Speedy build tooling',
      '6 months free support',
      '256-bit encryption',
      'Guaranteed 100% uptime',
      'Unlimited users',
    ],
    preferred: false,
    actionText: 'start with premium',
    description: 'Advanced features for scaling your business',
  },
];

function Pricing() {
  const [checked, setChecked] = useState(false);
  const pricingItems = PRICING.map((p) => (
    <PricingCard key={p.tier} monthly={checked} {...p} {...PAPER_PROPS} />
  ));

  return (
    <>
      <>
        <title>Pricing | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Pricing" breadcrumbItems={items} />
          <Paper style={{ backgroundColor: 'transparent' }}>
            <Stack>
              <Title order={2} ta="center">
                Simple, fair pricing.
              </Title>
              <Text size="lg" ta="center">
                All types of businesses need access to development resources, so
                we give you the option to decide how much you need to use.
              </Text>
              <Flex justify="center" gap="md">
                <Text>Annual</Text>
                <Switch
                  size="md"
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                />
                <Text>Monthly</Text>
              </Flex>
            </Stack>
          </Paper>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            {pricingItems}
          </SimpleGrid>
          <Surface component={Paper} {...PAPER_PROPS}>
            <Faqs />
          </Surface>
          <Surface
            component={Paper}
            style={{ backgroundColor: 'transparent' }}
            p="md"
          >
            <Stack align="center" gap="xs">
              <Text>Still have questions?</Text>
              <Button
                variant="subtle"
                rightSection={<IconChevronRight size={18} />}
              >
                Contact Us
              </Button>
            </Stack>
          </Surface>
        </Stack>
      </Container>
    </>
  );
}

export default Pricing;
