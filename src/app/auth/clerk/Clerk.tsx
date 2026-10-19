'use client';

import {
  SignIn,
  SignInButton,
  SignOutButton,
  SignUp,
  SignUpButton,
} from '@clerk/nextjs';
import {
  Button,
  Container,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconLogin, IconLogin2, IconUserCircle } from '@tabler/icons-react';

const ICON_SIZE = 18;

export function Clerk() {
  return (
    <Container>
      <Stack gap="lg">
        <Image src="/brands/clerk.svg" h={48} w={120} fit="contain" alt="" />
        <Stack gap="sm">
          <Title order={2}>Buttons</Title>
          <Text fz="sm">
            Click on the buttons to trigger a signup/signin using Clerk
          </Text>
          <Group>
            <SignInButton>
              <Button leftSection={<IconLogin2 size={ICON_SIZE} />}>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button leftSection={<IconUserCircle size={ICON_SIZE} />}>
                Sign Up
              </Button>
            </SignUpButton>
            <SignOutButton>
              <Button leftSection={<IconLogin size={ICON_SIZE} />}>
                Sign out
              </Button>
            </SignOutButton>
          </Group>
        </Stack>
        <Title order={2}>Cards</Title>
        <Flex align="flex-start">
          <Stack>
            <Title order={5}>Sign up</Title>
            <SignUp />
          </Stack>
          <Stack>
            <Title order={5}>Sign in</Title>
            <SignIn />
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
}
