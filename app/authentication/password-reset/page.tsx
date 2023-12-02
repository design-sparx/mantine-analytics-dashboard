'use client';

import {
  Button,
  Group,
  Paper,
  rem,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import React from 'react';
import Link from 'next/link';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import { useMediaQuery } from '@mantine/hooks';
import classes from './page.module.css';
import { Surface } from '@/components';
import { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Password Reset | DesignSparx',
  description:
    'Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!',
};

function Page() {
  const mobile_match = useMediaQuery('(max-width: 425px)');

  return (
    <>
      <>
        <title>Password Reset | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Title ta="center">Forgot your password?</Title>
      <Text ta="center">Enter your email to get a reset link</Text>

      <Surface component={Paper} className={classes.card}>
        <TextInput label="Your email" placeholder="me@email.com" required />
        <Group justify="space-between" mt="lg" className={classes.controls}>
          <UnstyledButton
            component={Link}
            href={PATH_AUTH.signin}
            color="dimmed"
            className={classes.control}
          >
            <Group gap={2} align="center">
              <IconChevronLeft
                stroke={1.5}
                style={{ width: rem(14), height: rem(14) }}
              />
              <Text size="sm" ml={5}>
                Back to the login page
              </Text>
            </Group>
          </UnstyledButton>
          <Button
            component={Link}
            href={PATH_DASHBOARD.default}
            fullWidth={mobile_match}
          >
            Reset password
          </Button>
        </Group>
      </Surface>
    </>
  );
}

export default Page;
