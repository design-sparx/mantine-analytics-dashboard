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

function Home() {
  return (
    <>
      <>
        <title>Clerk | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <>
        <Container>
          <Stack gap="lg">
            <Image
              src="/brands/clerk.svg"
              h={48}
              w={120}
              fit="contain"
              alt=""
            />
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
      </>
    </>
  );
}

export default Home;
