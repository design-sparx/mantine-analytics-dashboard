'use client';

import { useEffect } from 'react';

import {
  Button,
  Center,
  Code,
  Group,
  Stack,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconHome2, IconRefresh } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import classes from './error.module.css';

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <>
        <title>Server Error | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Center
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor:
            colorScheme === 'light'
              ? theme.colors.gray[0]
              : theme.colors.dark[8],
          color:
            colorScheme === 'light'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        }}
      >
        <Stack>
          <div className={classes.label}>400</div>
          <Title className={classes.title}>Sorry, unexpected error..</Title>
          <Code
            block
            color={`${colorScheme === 'light' ? 'red.1' : 'red.8'}`}
            c={`${colorScheme === 'light' ? 'red.7' : 'red.0'}`}
            fz="md"
            ta="center"
            className={classes.description}
          >
            {error.toString()}
          </Code>
          <Group justify="center" mt="md">
            <Button
              size="md"
              leftSection={<IconRefresh size={18} />}
              variant="default"
              onClick={() => window.location.reload}
            >
              Refresh Page
            </Button>
            <Button
              size="md"
              variant="default"
              leftSection={<IconHome2 size={18} />}
              onClick={() => router.push('/')}
            >
              Take me to home page
            </Button>
          </Group>
        </Stack>
      </Center>
    </>
  );
}

export default Error;
