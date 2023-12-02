'use client';

import { useEffect } from 'react';
import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconHome2, IconRefresh } from '@tabler/icons-react';
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
          backgroundColor: theme.colors.gray[0],
          color: theme.colors.dark[8],
        }}
      >
        <Stack>
          <div className={classes.label}>400</div>
          <Title className={classes.title}>Sorry, unexpected error..</Title>
          <Text fz="md" ta="center" className={classes.description}>
            {error.toString()}
          </Text>
          <Group justify="center" mt="md">
            <Button
              size="md"
              leftSection={<IconRefresh size={18} />}
              variant="subtle"
              onClick={() => window.location.reload}
            >
              Refresh Page
            </Button>
            <Button
              size="md"
              variant="subtle"
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
