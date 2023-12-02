'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import {
  Button,
  Center,
  Container,
  Divider,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconBrandAuth0, IconLogin, IconLogin2 } from '@tabler/icons-react';

const ICON_SIZE = 18;

export default function Page() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const userImg = session?.user?.image;
  const userName = session?.user?.name;

  if (status === 'loading') {
    return (
      <Center pt={40}>
        <Stack align="center">
          <Loader />
          <Text>Hang on there...</Text>
        </Stack>
      </Center>
    );
  }

  if (status === 'authenticated') {
    return (
      <Container fluid>
        <Stack gap="lg">
          <Group>
            <IconBrandAuth0 size={32} />
            <Title order={3}>Auth0</Title>
          </Group>
          <Divider />
          <Paper
            p="md"
            shadow="sm"
            w={320}
            component={Stack}
            gap="xs"
            align="center"
          >
            <Text c="green" fw={500}>
              Signed In
            </Text>
            <Image
              src={userImg}
              alt={userName || ''}
              h={120}
              w={120}
              radius="50%"
              fit="cover"
            />
            <Text>{userName}</Text>
            <Text fz="sm" c="dimmed">
              {userEmail}
            </Text>
            <Button
              onClick={() => signOut()}
              leftSection={<IconLogin size={ICON_SIZE} />}
              color="red"
              fullWidth
            >
              Sign out
            </Button>
          </Paper>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <>
        <title>Auth0 | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <Group>
            <IconBrandAuth0 size={32} />
            <Title order={3}>Auth0</Title>
          </Group>
          <Divider />
          <Paper p="md" shadow="sm" w={320}>
            <Stack>
              <Text c="red" fw={500}>
                Not signed In
              </Text>
              <Button
                onClick={() => signIn()}
                leftSection={<IconLogin2 size={ICON_SIZE} />}
              >
                Sign in
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
