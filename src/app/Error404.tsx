'use client';

import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronLeft, IconHome2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PATH_DASHBOARD } from '@/routes';

import classes from './error.module.css';

export function Error404() {
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <Center
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: theme.colors.gray[0],
        color: theme.colors.dark[8],
      }}
    >
      <Stack>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>You have found a secret place.</Title>
        <Text fz="md" ta="center" className={classes.description}>
          Unfortunately, this is only a 404 page. You may have mistyped the
          address, or the page has been moved to another URL.
        </Text>
        <Group justify="center" mt="md">
          <Button
            size="md"
            variant="outline"
            leftSection={<IconChevronLeft size={18} />}
            onClick={() => {
              router.back();
            }}
          >
            Go back
          </Button>
          <Button
            size="md"
            variant="outline"
            component={Link}
            leftSection={<IconHome2 size={18} />}
            href={PATH_DASHBOARD.default}
          >
            Take me to home page
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
